let tooltip = d3.select("body").append("div").attr("class", "toolTip");
const url = new URL(window.location.href);
let subject = url.searchParams.get("subject");

let margin = {top: 20, right: 20, bottom: 30, left: 40};
let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let xScaleBarChart = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
let yScaleBarChart = d3.scaleLinear()
    .range([height, 0]);

$(document).ready(function() {

    $.get('http://localhost:3000/fields', {}, function (data) {
        let items = [];

        if(subject == null){
            subject = data[0]['field'];
        }

        $.each(data, function (i, item) {
            items.push("<option value='" + item["field"] + "'>" + item["field"] + "</option>");
        });

        $('#dropdown-subject').html(items);
        $('#dropdown-subject').selectpicker('refresh');

        $('select[name=ddc]').val(subject);
        $('.selectpicker').selectpicker('refresh');

        $('#dropdown-subject').change(function(){
            field = $(this).val();

            updateBarChart(field)
        });

        updateBarChart(subject);
    });
});

function updateBarChart(field) {
    d3.select("#stacked-bar-chart-id").remove();

    let svg = d3.select("#stacked-bar-chart")
        .append("svg")
        .attr("id","stacked-bar-chart-id")
        .attr('class', 'pie')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    let g = svg.append("g")
        .attr("id","stacked-bar-chart-id")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set x scale
    let x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    // set y scale
    let y = d3.scaleLinear()
        .rangeRound([height, 0]);

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
            .attr("transform", "translate(0," + height + ")")
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
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });
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