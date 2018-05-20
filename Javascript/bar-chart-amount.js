let tooltip = d3.select("body").append("div").attr("class", "toolTip");

// set the dimensions and margins of the graph
let margin = {top: 20, right: 20, bottom: 30, left: 40},
    widthBarChart = 960 - margin.left - margin.right,
    heightBarChart = 400 - margin.top - margin.bottom;

// set the ranges
let xScaleBarChart = d3.scaleBand()
    .range([0, widthBarChart])
    .padding(0.1);
let yScaleBarChart = d3.scaleLinear()
    .range([heightBarChart, 0]);

function updateBarChart(type, iso) {
    d3.select("#bar-chart").remove();

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svgBarChart = d3.select("#bar-chart-amount").append("svg")
        .attr("id","bar-chart")
        .attr("width", widthBarChart + margin.left + margin.right)
        .attr("height", heightBarChart + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $.get('http://localhost:3000/country/' + iso + "/" + type, {}, function (data) {
        // Scale the range of the data in the domains
        xScaleBarChart.domain(data.map(function (d) {
            return d.opleiding;
        }));
        yScaleBarChart.domain([0, d3.max(data, function (d) {
            return d.amount;
        })]);

        // append the rectangles for the bar chart
        svgBarChart.selectAll(".bar")
            .remove()
            .exit()
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return xScaleBarChart(d.opleiding);
            })
            .attr("width", xScaleBarChart.bandwidth())
            .attr("y", function (d) {
                return yScaleBarChart(d.amount);
            })
            .attr("height", function (d) {
                return heightBarChart - yScaleBarChart(d.amount);
            })
            .on("mousemove", function (d) {
                d3.select(this).attr("fill", "#588C73");
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d.opleiding + ": " +d.amount);
            })
            .on("mouseout", function (d, i) {
                tooltip.style("display", "none");
            });

        // add the x
        svgBarChart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + heightBarChart + ")")
            .call(d3.axisBottom(xScaleBarChart))
            .selectAll(".tick text")
            .call(wrap, xScaleBarChart.bandwidth());

        // add the y Axis
        svgBarChart.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScaleBarChart));

        if (type === "Doctoraat") {
            $(".bar").css("fill", "rgb(31, 119, 180)");
            $(".bar").mouseover(function () {
                $(this).css("fill", "rgb(143, 187, 217)")
            }).mouseout(function () {
                $(this).css("fill", "rgb(31, 119, 180)")
            });
        } else if (type === "Exchange") {
            $(".bar").css("fill", "rgb(255, 127, 14)");
            $(".bar").mouseover(function () {
                $(this).css("fill", "rgb(255, 191, 134)")
            }).mouseout(function () {
                $(this).css("fill", "rgb(255, 127, 14)")
            });
        } else if (type === "Master") {
            $(".bar").css("fill", "rgb(44, 160, 44)");
            $(".bar").mouseover(function () {
                $(this).css("fill", "rgb(149, 207, 149)")
            }).mouseout(function () {
                $(this).css("fill", "rgb(44, 160, 44)")
            });
        }
    });
}

// Function to wrap long labels
function wrap(text, width) {
    text.each(function () {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word);
            }
        }
    })
}