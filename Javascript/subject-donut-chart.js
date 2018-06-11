let text = "";

let donutWidth = 450;
let donutHeight = 250;
let thickness = 50;

let radius = Math.min(donutWidth, donutHeight) / 2;

let color = d3.scaleOrdinal()
    .domain(["Man", "Vrouw"])
    .range(["#4693C5", "#FD1A44"]);

let hovercolor = d3.scaleOrdinal()
    .domain(["Man", "Vrouw"])
    .range(["#6FC4C5", "#FD8788"]);

function updateDonutChart(field) {
    d3.select("#donut-chart-id").remove();

    $.get('http://localhost:3000/gender/count/' + field, {}, function (data) {
        let svg = d3.select("#donut-chart")
            .append('svg')
            .attr("id","donut-chart-id")
            .attr('class', 'pie')
            .attr('width', donutWidth)
            .attr('height', donutHeight);

        let g = svg.append('g')
            .attr('transform', 'translate(' + (donutWidth/2) + ',' + (donutHeight/2) + ')');

        let arc = d3.arc()
            .innerRadius(radius - thickness)
            .outerRadius(radius);

        let pie = d3.pie()
            .value(function(d) { return d.amount; })
            .sort(null);

        let path = g.selectAll('path')
            .data(pie(data))
            .enter()
            .append("g")
            .on("mouseover", function(d) {
                let g;
                g = d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", "lightgray")
                    .append("g")
                    .attr("class", "text-group");

                g.append("text")
                    .attr("class", "type-text")
                    .text(`${d.data.gender}`)
                    .attr('text-anchor', 'middle')
                    .attr('dy', '-1.2em');

                g.append("text")
                    .attr("class", "amount-text")
                    .text(`${d.data.amount}`)
                    .attr('text-anchor', 'middle')
                    .attr('dy', '.6em');
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .style("cursor", "none")
                    .style("fill", color(d.data.gender))
                    .select(".text-group").remove();
            })
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.gender);
            })
            .on("mouseover", function(d) {
                d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", hovercolor(d.data.gender));
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .style("cursor", "none")
                    .style("fill", color(d.data.gender));
            })
            .each(function(d, i) { this._current = i; });

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(text);

        let legendG = svg.selectAll(".legend")
            .data(pie(data))
            .enter().append("g")
            .attr("transform", function(d,i){
                return "translate(" + (donutWidth - 110) + "," + (i * 15 + 20) + ")";
            })
            .attr("class", "legend");

        legendG.append("rect")
            .attr("x", -340)
            .attr("y", -15)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", function(d, i) {
                return color(d.data.gender);
            });

        legendG.append("text")
            .text(function(d){
                return d.data.gender + ' (' + d.data.amount + ')';
            })
            .style("font-size", 12)
            .attr("y", -5)
            .attr("x", -328);
    });
}