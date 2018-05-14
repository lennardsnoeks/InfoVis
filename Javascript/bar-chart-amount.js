const dataBarChart = [{"food":"Hotdogs","quantity":24},
    {"food":"Tacos","quantity":15},
    {"food":"Pizza","quantity":3},
    {"food":"Double Quarter Pounders with Cheese","quantity":2},
    {"food":"Omelets","quantity":30},
    {"food":"Falafel and Hummus","quantity":21},
    {"food":"Soylent","quantity":13}];

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

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
let svgBarChart = d3.select("#bar-chart-amount").append("svg")
    .attr("width", widthBarChart + margin.left + margin.right)
    .attr("height", heightBarChart + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Scale the range of the data in the domains
xScaleBarChart.domain(dataBarChart.map(function(d) { return d.food; }));
yScaleBarChart.domain([0, d3.max(dataBarChart, function(d) { return d.quantity; })]);

// append the rectangles for the bar chart
svgBarChart.selectAll(".bar")
    .data(dataBarChart)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xScaleBarChart(d.food); })
    .attr("width", xScaleBarChart.bandwidth())
    .attr("y", function(d) { return yScaleBarChart(d.quantity); })
    .attr("height", function(d) { return heightBarChart - yScaleBarChart(d.quantity); })
    .on("mousemove", function(d){
        d3.select(this).attr("fill", "#588C73");
        tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html("testfezfezfzefzefz");
    })
    .on("mouseout", function(d, i) {
        tooltip.style("display", "none");
    });

// add the x Axis
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

// Function to wrap long labels
function wrap(text, width) {
    text.each(function() {
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

d3.selectAll("path").on("click", function(e) {
    let name = e.data.name;
    if(name === "Doctoraat") {
        $(".bar").css("fill", "rgb(31, 119, 180)");
        $(".bar").mouseover(function() {
            $(this).css("fill", "rgb(143, 187, 217)")
        }).mouseout(function() {
            $(this).css("fill", "rgb(31, 119, 180)")
        });
    } else if(name === "Exchange") {
        $(".bar").css("fill", "rgb(255, 127, 14)");
        $(".bar").mouseover(function() {
            $(this).css("fill", "rgb(255, 191, 134)")
        }).mouseout(function() {
            $(this).css("fill", "rgb(255, 127, 14)")
        });
    } else if(name === "Master") {
        $(".bar").css("fill", "rgb(44, 160, 44)");
        $(".bar").mouseover(function() {
            $(this).css("fill", "rgb(149, 207, 149)")
        }).mouseout(function() {
            $(this).css("fill", "rgb(44, 160, 44)")
        });
    }
});