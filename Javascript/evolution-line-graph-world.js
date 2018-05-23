drawEvolution();

function drawEvolution() {
    d3version4.select("#evolution-chart-id").remove();

    // set the dimensions and margins of the graph
    let margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // parse the date / time
    /*let parseTime = d3.timeParse("%Y-%Y");*/

    let x = d3version4.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3version4.scaleLinear().rangeRound([height, 0]);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svg = d3version4.select("#evolution-chart")
        .append("svg")
        .attr("id", "evolution-chart-id")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    $.get('http://localhost:3000/amountyearsworld', {}, function (data) {
        // format the data
        data.forEach(function(d) {
            d.amount = +d.amount;
        });

        x.domain(data.map(function(d) { return d.year; }));
        y.domain([0, d3version4.max(data, function(d) { return d.amount; })]);

        // define the line
        let valueline = d3version4.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.amount); });

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3version4.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3version4.axisLeft(y));
    });
}