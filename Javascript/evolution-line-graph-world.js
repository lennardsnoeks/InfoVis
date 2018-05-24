function drawEvolution(typesArray) {
    d3version4.select("#evolution-chart-world-id").remove();

    let margin = {top: 20, right: 80, bottom: 80, left: 40},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let svg = d3version4.select("#evolution-chart-world")
        .append("svg")
        .attr("id", "evolution-chart-world-id")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let parseTime = d3version4.timeParse("%Y"),
        bisectDate = d3version4.bisector(function (d) {
            return d.year;
        }).left;

    let x = d3version4.scaleTime().range([0, width]);
    let y = d3version4.scaleLinear().range([height, 0]);

    let line = d3version4.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.amount);
        });

    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $.get('http://localhost:3000/amountyearsworldtype?types=' + typesArray.toString(), {}, function (data) {
        let amountYears = 0;
        let totalAmount = 0;

        data.forEach(function (d) {
            amountYears++;
            d.year = parseTime(d.year.split("-")[0]);
            d.amount = +d.amount;
            totalAmount += d.amount;
        });

        let growthAnnual, growthTotal;
        let lastYearAmount, previousYearAmount;

        if(amountYears > 1) {
            // Calculate percentage growth of all years and versus previous year
            let differenceTotal, differenceAnnual, firstYearAmount;

            firstYearAmount = parseInt(data[0].amount);
            lastYearAmount = parseInt(data[amountYears - 1].amount);
            previousYearAmount = parseInt(data[amountYears - 2].amount);

            differenceAnnual = (lastYearAmount - previousYearAmount);
            growthAnnual = (differenceAnnual / previousYearAmount) * 100;

            differenceTotal = (lastYearAmount - firstYearAmount);
            growthTotal = (differenceTotal / firstYearAmount) * 100;
        } else {
            growthTotal = 0;
            growthAnnual = 0;
            previousYearAmount = 0;
            lastYearAmount = 0;
        }

        /*if(growthAnnual > 0) {
            $("#annual-growth").html(previousYearAmount + " (" + Number((growthAnnual).toFixed(1)) + "% <span class='up glyphicon glyphicon-triangle-top'></span>)");
        } else if(growthAnnual < 0) {
            $("#annual-growth").html(previousYearAmount + " (" + Number((growthAnnual).toFixed(1)) + "% <span class='down glyphicon glyphicon-triangle-bottom'></span>)");
        } else {
            $("#annual-growth").html(previousYearAmount + " (" + Number((growthAnnual).toFixed(1)) + "% <span class='even glyphicon glyphicon-minus'></span>)");
        }*/

        if(growthAnnual > 0) {
            $("#annual-growth").html(previousYearAmount + " <span class='percentage' style=\"color: green\">(" + Math.abs(Number((growthAnnual).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span>)</span>");
        } else if(growthAnnual < 0) {
            $("#annual-growth").html(previousYearAmount + " <span class='percentage' style=\"color: red\">(" + Math.abs(Number((growthAnnual).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span>)</span>");
        } else {
            $("#annual-growth").html(previousYearAmount + " <span class='percentage' style=\"color: black\">(" + Math.abs(Number((growthAnnual).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span>)</span>");
        }

        /*if(growthTotal > 0) {
            $("#total-growth").html(lastYearAmount + " (" + Number((growthTotal).toFixed(1)) + "% <span class='up glyphicon glyphicon-triangle-top'></span>)");
        } else if(growthTotal < 0) {
            $("#total-growth").html(lastYearAmount + " (" + Number((growthTotal).toFixed(1)) + "% <span class='down glyphicon glyphicon-triangle-bottom'></span>)");
        } else {
            $("#total-growth").html(lastYearAmount + " (" + Number((growthTotal).toFixed(1)) + "% <span class='even glyphicon glyphicon-minus'></span>)");
        }*/

        if(growthTotal > 0) {
            $("#total-growth").html(totalAmount + " <span class='percentage' style=\"color: green\">(" + Math.abs(Number((growthTotal).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span>)</span>");
        } else if(growthTotal < 0) {
            $("#total-growth").html(totalAmount + " <span class='percentage' style=\"color: red\">(" + Math.abs(Number((growthTotal).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span>)</span>");
        } else {
            $("#total-growth").html(totalAmount + " <span class='percentage' style=\"color: black\">(" + Math.abs(Number((growthTotal).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span>)</span>");
        }

        x.domain(d3version4.extent(data, function (d) {
            return d.year;
        }));
        y.domain([0, d3version4.max(data, function (d) {
            return d.amount;
        })]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3version4.axisBottom(x).
            tickFormat(function(date) {
                return d3version4.timeFormat('%Y')(date);
            }).ticks(amountYears));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3version4.axisLeft(y).ticks(6).tickFormat(function (d) {
                return parseInt(d);
            }))
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text("Inschrijvingen");

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        let focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);

        focus.append("circle")
            .attr("r", 7.5);

        focus.append("text")
            .attr("x", 15)
            .attr("dy", ".31em");

        svg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlaychart")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function () {
                focus.style("display", null);
            })
            .on("mouseout", function () {
                focus.style("display", "none");
            })
            .on("mousemove", mousemove)
            .on("click", clicked);

        function mousemove() {
            let x0 = x.invert(d3version4.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.year) + "," + y(d.amount) + ")");
            focus.select("text").text(function () {
                return d.amount;
            });
            focus.select(".x-hover-line").attr("y2", height - y(d.amount));
            focus.select(".y-hover-line").attr("x2", width + width);
        }

        function clicked() {
            let x0 = x.invert(d3version4.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            console.log(d.year + "," + d.amount);
        }
    });
}