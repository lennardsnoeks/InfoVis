let margin = {top: 20, right: 20, bottom: 30, left: 40};
let barChartWidth = 960 - margin.left - margin.right;
let barChartHeight = 500 - margin.top - margin.bottom;

/*
let xScaleBarChart = d3.scaleBand()
    .range([0, barChartWidth])
    .padding(0.1);
let yScaleBarChart = d3.scaleLinear()
    .range([barChartHeight, 0]);
    */

var labelArea = 160;
var chart, width = 400, bar_height = 20;
var rightOffset = width + labelArea;

var lCol = "male";
var rCol = "female";

function updateBarChart(field) {
    /*
    d3.select("#stacked-bar-chart-id").remove();

    let svg = d3.select("#stacked-bar-chart")
        .append("svg")
        .attr("id","stacked-bar-chart-id")
        .attr('class', 'pie')
        .attr("width", barChartWidth + margin.left + margin.right)
        .attr("height", barChartHeight + margin.top + margin.bottom);

    let g = svg.append("g")
        .attr("id","stacked-bar-chart-id")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set x scale
    let x = d3.scaleBand()
        .rangeRound([0, barChartWidth])
        .paddingInner(0.05)
        .align(0.1);

    // set y scale
    let y = d3.scaleLinear()
        .rangeRound([barChartHeight, 0]);

    // set the colors
    let z = d3.scaleOrdinal()
        .range(["#4693C5", "#FD1A44"]);

    // load the csv and create the chart
    $.get('http://localhost:3000/gender/' + field, {} , function (data) {
        let dataset = data.map(function(d) {
            let total = d.male + d.female;
            return {country: d.country, male: d.male, female: d.female, total: total};
        });

        xScaleBarChart.domain(dataset.map(function (d) {
            return d.country;
        }));
        yScaleBarChart.domain([0, d3.max(dataset, function (d) {
            return d.total;
        })]);

        let keys = ["male", "female"];

        dataset.sort(function(a, b) { return b.total - a.total; });
        x.domain(dataset.map(function(d) { return d.country; }));
        y.domain([0, d3.max(dataset, function(d) { return d.total; })]).nice();
        z.domain(keys);

        g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(dataset))
            .enter().append("g")
            .attr("fill", function(d) { return z(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data.country); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                tooltip.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d[1]-d[0]);
            });

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + barChartHeight + ")")
            .call(d3.axisBottom(x))
            .selectAll(".tick text")
            .call(wrap, x.bandwidth());

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start");

        let legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(["Man", "Vrouw"])
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", barChartWidth - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", barChartWidth - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });
    });
    */
    d3.select("#stacked-bar-chart-id").remove();

    $.get('http://localhost:3000/gender/' + field, { }, function (data) {
        let height = bar_height * data.length;

        var scale = d3.scaleLinear()
            .range([0, width - 50]);
        //var xTo = d3.scaleLinear()
        //    .range([0, width - 50]);
        var y = d3version3.scale.ordinal()
            .rangeBands([20, height]);

        var chart = d3.select("#stacked-bar-chart")
            .append('svg')
            .attr("id","stacked-bar-chart-id")
            .attr('class', 'chart')
            .attr('width', labelArea + width + width)
            .attr('height', height + 50);

        scale.domain([0, d3.max(data, function (d) {
            return d["male"];
        })]);

        y.domain(data.map(function (d) {
            return d.country;
        }));

        var yPosByIndex = function (d) {
            return y(d.country);
        };

        chart.selectAll("rect.left")
            .data(data)
            .enter().append("rect")
            .attr("x", function (d) {
                return width - scale(d[lCol]);
            })
            .attr("y", yPosByIndex)
            .attr("class", "left")
            .attr("width", function (d) {
                return scale(d[lCol]);
            })
            .attr("height", y.rangeBand());

        chart.selectAll("text.leftscore")
            .data(data)
            .enter().append("text")
            .attr("x", function (d) {
                return width - scale(d[lCol]) - 40;
            })
            .attr("y", function (d) {
                return y(d.country) + y.rangeBand() / 2;
            })
            .attr("dx", "20")
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'leftscore')
            .text(function (d) {
                return d[lCol];
            });

        chart.selectAll("text.name")
            .data(data)
            .enter().append("text")
            .attr("x", (labelArea / 2) + width)
            .attr("y", function (d) {
                return y(d.country) + y.rangeBand() / 2;
            })
            .attr("dy", ".20em")
            .attr("text-anchor", "middle")
            .attr('class', 'name')
            .text(function (d) {
                return d.country;
            });

        chart.selectAll("rect.right")
            .data(data)
            .enter().append("rect")
            .attr("x", rightOffset)
            .attr("y", yPosByIndex)
            .attr("class", "right")
            .attr("width", function (d) {
                return scale(d[rCol]);
            })
            .attr("height", y.rangeBand());

        chart.selectAll("text.score")
            .data(data)
            .enter().append("text")
            .attr("x", function (d) {
                return scale(d[rCol]) + rightOffset + 40;
            })
            .attr("y", function (d) {
                return y(d.country) + y.rangeBand() / 2;
            })
            .attr("dx", -5)
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'score')
            .text(function (d) {
                return d[rCol];
            });

        chart.append("text").attr("x", width / 2).attr("y", 10).attr("class", "title").text("Man");
        chart.append("text").attr("x", width / 3 + rightOffset).attr("y", 10).attr("class", "title").text("Vrouw");
        chart.append("text").attr("x", width + labelArea / 3).attr("y", 10).attr("class", "title").text("Landen");
    });
}
