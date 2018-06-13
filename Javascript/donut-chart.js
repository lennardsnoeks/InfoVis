let text = "";

let width = 450;
let height = 250;
let thickness = 50;

let radius = Math.min(width, height) / 2;

let color = d3.scaleOrdinal()
    .domain(["Master", "Doctoraat", "Exchange"])
    .range(["#65C400" , "#2290EE" , "#FF3300"]);

let hovercolor = d3.scaleOrdinal()
    .domain(["Master", "Doctoraat", "Exchange"])
    .range(["#C1FF80" , "#A0CFF8" , "#FF8566"]);

function drawVisualisation(iso, yearsArray) {
    drawDonut(iso, yearsArray);
    drawEvolution(iso, typesArray);

    $.get('http://localhost:3000/name/' + iso, {}, function (data) {
        $('#country1').text(data[0]["land"]);
    });
}

function drawDonut(iso, yearsArray) {
    d3.select("#donut-chart-id").remove();

    $.get('http://localhost:3000/countrytype?iso=' + iso + '&years=' + yearsArray.toString(), {}, function (data) {
        console.log(data);
        let svg = d3.select("#donut-chart")
            .append('svg')
            .attr("id","donut-chart-id")
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
                g = d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", "lightgray")
                    .append("g")
                    .attr("class", "text-group");

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
                    .style("fill", color(d.data.type))
                    .select(".text-group").remove();
            })
            .on("click", function(d) {
                updateBarChart(d.data.type, iso, yearsArray);
            })
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.type);
            })
            .on("mouseover", function(d) {
                d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", hovercolor(d.data.type));
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .style("cursor", "none")
                    .style("fill", color(d.data.type));
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
                return color(d.data.type);
            });

        legendG.append("text")
            .text(function(d){
                return d.data.type + ' (' + d.data.amount + ')';
            })
            .style("font-size", 12)
            .attr("y", -5)
            .attr("x", -328);

        updateBarChart(data[0]['type'], iso, yearsArray);
    });
}

function drawVisualisation2(iso, yearsArray) {
    drawDonut2(iso, yearsArray);
    //drawEvolution2(iso, typesArray);

    $.get('http://localhost:3000/name/' + iso, {}, function (data) {
        $('#country2').text(data[0]["land"]);
    });
}

function drawDonut2(iso, yearsArray) {
    d3.select("#donut-chart-id-2").remove();

    $.get('http://localhost:3000/countrytype?iso=' + iso + '&years=' + yearsArray.toString(), {}, function (data) {
        console.log(data);
        let svg = d3.select("#donut-chart-2")
            .append('svg')
            .attr("id","donut-chart-id-2")
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
                g = d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", "lightgray")
                    .append("g")
                    .attr("class", "text-group");

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
                    .style("fill", color(d.data.type))
                    .select(".text-group").remove();
            })
            .on("click", function(d) {
                updateBarChart(d.data.type, iso, yearsArray);
            })
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.type);
            })
            .on("mouseover", function(d) {
                d3.select(this)
                    .style("cursor", "pointer")
                    .style("fill", hovercolor(d.data.type));
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .style("cursor", "none")
                    .style("fill", color(d.data.type));
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
                return color(d.data.type);
            });

        legendG.append("text")
            .text(function(d){
                return d.data.type + ' (' + d.data.amount + ')';
            })
            .style("font-size", 12)
            .attr("y", -5)
            .attr("x", -328);

        updateBarChart2(data[0]['type'], iso, yearsArray);
    });
}
