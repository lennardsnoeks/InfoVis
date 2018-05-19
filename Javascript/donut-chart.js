let text = "";

let width = 500;
let height = 250;
let thickness = 50;

let radius = Math.min(width, height) / 2;
let color = d3.scaleOrdinal(d3.schemeCategory10);

$.get('http://localhost:3000/country/' + iso, {}, function (data) {
    let svg = d3.select("#donut-chart")
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);

    let g = svg.append('g')
        .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

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
            if(d.data.type === "Doctoraat") {
                g = d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", "rgb(143, 187, 217)")
                    .append("g")
                    .attr("class", "text-group");
            } else if(d.data.type === "Master") {
                g = d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", "rgb(149, 207, 149)")
                    .append("g")
                    .attr("class", "text-group");
            } else if(d.data.type === "Exchange") {
                g = d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", "rgb(255, 191, 134)")
                    .append("g")
                    .attr("class", "text-group");
            }

            g.append("text")
                .attr("class", "type-text")
                .text(`${d.data.type}`)
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
                .style("fill", color(this._current))
                .select(".text-group").remove();
        })
        .on("click", function(d) {
            updateBarChart(d.data.type);
        })
        .append('path')
        .attr('d', arc)
        .attr('fill', (d,i) => color(i))
        .on("mouseover", function(d) {
            if(d.data.type === "Doctoraat") {
                d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", "rgb(143, 187, 217)");
            } else if(d.data.type === "Master") {
                d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", "rgb(149, 207, 149)")
            } else if(d.data.type === "Exchange") {
                d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", "rgb(255, 191, 134)")
            }
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", color(this._current));
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
            return "translate(" + (width - 110) + "," + (i * 15 + 20) + ")";
        })
        .attr("class", "legend");

    legendG.append("rect")
        .attr("x", -340)
        .attr("y", -15)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d, i) {
            return color(i);
        });

    legendG.append("text")
        .text(function(d){
            return d.data.type + ' (' + d.data.amount + ')';
        })
        .style("font-size", 12)
        .attr("y", -5)
        .attr("x", -328);
});