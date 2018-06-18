let tooltip = d3.select("body").append("div").attr("class", "toolTip");

// set the dimensions and margins of the graph
let margin = {top: 20, right: 20, bottom: 90, left: 40},
    widthBarChart = 900 - margin.left - margin.right,
    heightBarChart = 400 - margin.top - margin.bottom;

// set the ranges
let xScaleBarChart = d3.scaleBand()
    .range([0, widthBarChart])
    .padding(0.1);
let yScaleBarChart = d3.scaleLinear()
    .range([heightBarChart, 0]);

function updateBarChart(type, iso, yearsArray) {
    d3.select("#bar-chart-id").remove();

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svgBarChart = d3.select("#bar-chart-amount")
        .append("svg")
        .attr("id","bar-chart-id")
        .attr("width", widthBarChart + margin.left + margin.right)
        .attr("height", heightBarChart + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $.get('http://localhost:3000/countryfields?iso=' + iso + "&type=" + type + "&years=" + yearsArray.toString(), {}, function (data) {
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
            .attr('fill', color(type))
            .on("mousemove", function (d) {
                tooltip.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d.opleiding + ": " +d.amount);
            })
            .on("mouseover", function(d, i) {
                d3.select(this).style("fill", hovercolor(type));
            })
            .on("mouseout", function (d, i) {
                d3.select(this).style("fill", color(type));
                tooltip.style("display", "none");
            })
            .on("click", function (d, i) {
                window.location.href = "http://localhost:63342/InfoVis/subject-info.html?"
                    + "subject=" + d.opleiding
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
    });
}

function updateBarChart2(type, iso, yearsArray) {
    d3.select("#bar-chart-id-2").remove();

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svgBarChart = d3.select("#bar-chart-amount-2")
        .append("svg")
        .attr("id","bar-chart-id-2")
        .attr("width", widthBarChart + margin.left + margin.right)
        .attr("height", heightBarChart + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $.get('http://localhost:3000/countryfields?iso=' + iso + "&type=" + type + "&years=" + yearsArray.toString(), {}, function (data) {
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
            .attr('fill', color(type))
            .on("mousemove", function (d) {
                tooltip.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d.opleiding + ": " +d.amount);
            })
            .on("mouseover", function(d, i) {
                d3.select(this).style("fill", hovercolor(type));
            })
            .on("mouseout", function (d, i) {
                d3.select(this).style("fill", color(type));
                tooltip.style("display", "none");
            })
            .on("click", function (d, i) {
                window.location.href = "http://localhost:63342/InfoVis/subject-info.html?"
                    + "subject=" + d.opleiding
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