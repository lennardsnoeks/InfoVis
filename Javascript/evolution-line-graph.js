function drawEvolution(iso, isoCompare, typesArray) {
    d3.select("#evolution-chart-country-id").remove();

    let margin = {top: 20, right: 80, bottom: 80, left: 40},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let svg = d3.select("#evolution-chart-country")
        .append("svg")
        .attr("id", "evolution-chart-country-id")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let parseTime = d3.timeParse("%Y"),
    bisectDate = d3.bisector(function (d) {
        return d.year;
    }).left;

    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    let line = d3.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.amount);
        });

    let line2 = d3.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.amount);
        });

    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $.get('http://localhost:3000/amountyearscountrytype?iso=' + iso + '&types=' + typesArray.toString(), {}, function (data) {
        if(isoCompare === "") {
            let amountYears = 0;

            let percentageMap = {};
            let amountMap = {};

            let firstYear = 1;
            let previousAmount;
            let year = "";

            data.forEach(function (d) {
                year = d.year.split("-")[0];

                amountMap[year] = d.amount;

                if(firstYear === 1) {
                    firstYear = 0;
                    percentageMap[year] = 0;
                } else {
                    percentageMap[year] = Number((((d.amount - previousAmount) / previousAmount)  * 100).toFixed(1));
                }

                previousAmount = d.amount;

                amountYears++;
                d.year = parseTime(year);
                d.amount = +d.amount;
            });

            $("#year-title").text(year);

            let growthTotal, growthAnnual, amountAnnual;

            if(amountYears > 1) {
                // Calculate percentage growth of all years and versus previous year
                let differenceTotal, firstYearAmount, lastYearAmount;

                firstYearAmount = parseInt(data[0].amount);
                lastYearAmount = parseInt(data[amountYears - 1].amount);

                differenceTotal = (lastYearAmount - firstYearAmount);
                growthTotal = (differenceTotal / firstYearAmount) * 100;
            } else {
                growthTotal = 0;
            }

            if(amountYears > 0) {
                growthAnnual = percentageMap[year];
                amountAnnual = amountMap[year];
            } else {
                growthAnnual = 0;
                amountAnnual = 0;
            }

            if(growthAnnual > 0) {
                $("#annual-growth").html(amountAnnual + " <span class='percentage1' style=\"color: green\">(" + Math.abs(Number((growthAnnual).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span>)</span>");
            } else if(growthAnnual < 0) {
                $("#annual-growth").html(amountAnnual + " <span class='percentage1' style=\"color: red\">(" + Math.abs(Number((growthAnnual).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span>)</span>");
            } else {
                $("#annual-growth").html(amountAnnual + " <span class='percentage1' style=\"color: black\">(" + Math.abs(Number((growthAnnual).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span>)</span>");
            }

            if(growthTotal > 0) {
                $("#total-growth").html("<span class='percentage2' style=\"color: green\">" + Math.abs(Number((growthTotal).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span></span>");
            } else if(growthTotal < 0) {
                $("#total-growth").html("<span class='percentage2' style=\"color: red\">" + Math.abs(Number((growthTotal).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span></span>");
            } else {
                $("#total-growth").html("<span class='percentage2' style=\"color: black\">" + Math.abs(Number((growthTotal).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span></span>");
            }

            x.domain(d3.extent(data, function (d) {
                return d.year;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.amount;
            })]);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).
                tickFormat(function(date) {
                    return d3.timeFormat('%Y')(date);
                }).ticks(amountYears));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(6).tickFormat(function (d) {
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
                .attr("d", line)
                .attr("stroke", "hotpink");

            let focus = g.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("line")
                .attr("class", "x-hover-line hover-line")
                .attr("y1", 0)
                .attr("y2", height);

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
                .style("cursor", "pointer")
                .on("mouseover", function () {
                    focus.style("display", null);
                })
                .on("mouseout", function () {
                    focus.style("display", "none");
                })
                .on("mousemove", mousemove)
                .on("click", clicked);

            function mousemove() {
                let x0 = x.invert(d3.mouse(this)[0]),
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
                let x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.year > d1.year - x0 ? d1 : d0;

                let year = d.year.toString().split(" ")[3];

                if(percentageMap[year] > 0) {
                    $("#annual-growth").html(amountMap[year] + " <span class='percentage' style=\"color: green\">(" + Math.abs(Number((percentageMap[year]).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span>)</span>");
                } else if(percentageMap[year] < 0) {
                    $("#annual-growth").html(amountMap[year] + " <span class='percentage' style=\"color: red\">(" + Math.abs(Number((percentageMap[year]).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span>)</span>");
                } else {
                    $("#annual-growth").html(amountMap[year] + " <span class='percentage' style=\"color: black\">(" + Math.abs(Number((percentageMap[year]).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span>)</span>");
                }

                $("#year-title").text(year);
            }
        } else {
            $.get('http://localhost:3000/amountyearscountrytype?iso=' + isoCompare + '&types=' + typesArray.toString(), {}, function (data2) {
                let amountYears1 = 0;
                let amountYears2 = 0;

                let percentageMap1 = {};
                let percentageMap2 = {};

                let amountMap1 = {};
                let amountMap2 = {};

                let firstYear1 = 1;
                let firstYear2 = 1;

                let previousAmount;

                let year1 = "";
                let year2 = "";

                data.forEach(function (d) {
                    year1 = d.year.split("-")[0];

                    amountMap1[year1] = d.amount;

                    if(firstYear1 === 1) {
                        firstYear1 = 0;
                        percentageMap1[year1] = 0;
                    } else {
                        percentageMap1[year1] = Number((((d.amount - previousAmount) / previousAmount)  * 100).toFixed(1));
                    }

                    previousAmount = d.amount;

                    amountYears1++;
                    d.year = parseTime(year1);
                    d.amount = +d.amount;
                });

                data2.forEach(function (d) {
                    year2 = d.year.split("-")[0];

                    amountMap2[year2] = d.amount;

                    if(firstYear2 === 1) {
                        firstYear2 = 0;
                        percentageMap2[year2] = 0;
                    } else {
                        percentageMap2[year2] = Number((((d.amount - previousAmount) / previousAmount)  * 100).toFixed(1));
                    }

                    previousAmount = d.amount;

                    amountYears2++;
                    d.year = parseTime(year2);
                    d.amount = +d.amount;
                });

                $("#year-title").text(year1);
                $("#year-title2").text(year2);

                let growthTotal1, growthAnnual1, amountAnnual1;
                let growthTotal2, growthAnnual2, amountAnnual2;

                // ########### First country percentage info ###########

                if(amountYears1 > 1) {
                    // Calculate percentage growth of all years and versus previous year
                    let differenceTotal, firstYearAmount, lastYearAmount;

                    firstYearAmount = parseInt(data[0].amount);
                    lastYearAmount = parseInt(data[amountYears1 - 1].amount);

                    differenceTotal = (lastYearAmount - firstYearAmount);
                    growthTotal1 = (differenceTotal / firstYearAmount) * 100;
                } else {
                    growthTotal1 = 0;
                }

                if(amountYears1 > 0) {
                    growthAnnual1 = percentageMap1[year1];
                    amountAnnual1 = amountMap1[year1];
                } else {
                    growthAnnual1 = 0;
                    amountAnnual1 = 0;
                }

                if(growthAnnual1 > 0) {
                    $("#annual-growth").html(amountAnnual1 + " <span class='percentage1' style=\"color: green\">(" + Math.abs(Number((growthAnnual1).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span>)</span>");
                } else if(growthAnnual1 < 0) {
                    $("#annual-growth").html(amountAnnual1 + " <span class='percentage1' style=\"color: red\">(" + Math.abs(Number((growthAnnual1).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span>)</span>");
                } else {
                    $("#annual-growth").html(amountAnnual1 + " <span class='percentage1' style=\"color: black\">(" + Math.abs(Number((growthAnnual1).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span>)</span>");
                }

                if(growthTotal1 > 0) {
                    $("#total-growth").html("<span class='percentage2' style=\"color: green\">" + Math.abs(Number((growthTotal1).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span></span>");
                } else if(growthTotal1 < 0) {
                    $("#total-growth").html("<span class='percentage2' style=\"color: red\">" + Math.abs(Number((growthTotal1).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span></span>");
                } else {
                    $("#total-growth").html("<span class='percentage2' style=\"color: black\">" + Math.abs(Number((growthTotal1).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span></span>");
                }

                // ########### End first country percentage info ###########

                // ########### Second country percentage info ###########

                if(amountYears2 > 1) {
                    // Calculate percentage growth of all years and versus previous year
                    let differenceTotal, firstYearAmount, lastYearAmount;

                    firstYearAmount = parseInt(data2[0].amount);
                    lastYearAmount = parseInt(data2[amountYears2 - 1].amount);

                    differenceTotal = (lastYearAmount - firstYearAmount);
                    growthTotal2 = (differenceTotal / firstYearAmount) * 100;
                } else {
                    growthTotal2 = 0;
                }

                if(amountYears2 > 0) {
                    growthAnnual2 = percentageMap2[year2];
                    amountAnnual2 = amountMap2[year2];
                } else {
                    growthAnnual2 = 0;
                    amountAnnual2 = 0;
                }

                if(growthAnnual2 > 0) {
                    $("#annual-growth2").html(amountAnnual2 + " <span class='percentage1' style=\"color: green\">(" + Math.abs(Number((growthAnnual2).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span>)</span>");
                } else if(growthAnnual1 < 0) {
                    $("#annual-growth2").html(amountAnnual2 + " <span class='percentage1' style=\"color: red\">(" + Math.abs(Number((growthAnnual2).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span>)</span>");
                } else {
                    $("#annual-growth2").html(amountAnnual2 + " <span class='percentage1' style=\"color: black\">(" + Math.abs(Number((growthAnnual2).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span>)</span>");
                }

                if(growthTotal2 > 0) {
                    $("#total-growth2").html("<span class='percentage2' style=\"color: green\">" + Math.abs(Number((growthTotal2).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span></span>");
                } else if(growthTotal2 < 0) {
                    $("#total-growth2").html("<span class='percentage2' style=\"color: red\">" + Math.abs(Number((growthTotal2).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span></span>");
                } else {
                    $("#total-growth2").html("<span class='percentage2' style=\"color: black\">" + Math.abs(Number((growthTotal2).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span></span>");
                }

                // ########### End second country percentage info ###########

                x.domain(d3.extent(data, function (d) {
                    return d.year;
                }));

                y.domain([0, Math.max( d3.max(data, function (d) {return d.amount;}) , d3.max(data2, function (d) {return d.amount;}) ) ]);

                g.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x).
                    tickFormat(function(date) {
                        return d3.timeFormat('%Y')(date);
                    }).ticks(amountYears1));

                g.append("g")
                    .attr("class", "axis axis--y")
                    .call(d3.axisLeft(y).ticks(6).tickFormat(function (d) {
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
                    .attr("d", line)
                    .attr("stroke", "hotpink");

                g.append("path")
                    .datum(data2)
                    .attr("class", "line")
                    .attr("d", line2)
                    .attr("stroke", "yellowgreen");

                let focus = g.append("g")
                    .attr("class", "focus")
                    .style("display", "none");

                focus.append("line")
                    .attr("class", "x-hover-line hover-line")
                    .attr("y1", 0)
                    .attr("y2", height);

                focus.append("circle")
                    .attr("r", 7.5);

                focus.append("text")
                    .attr("x", 15)
                    .attr("dy", ".31em");

                let focus2 = g.append("g")
                    .attr("class", "focus")
                    .style("display", "none");

                focus2.append("line")
                    .attr("class", "x-hover-line hover-line")
                    .attr("y1", 0)
                    .attr("y2", height);

                focus2.append("circle")
                    .attr("r", 7.5);

                focus2.append("text")
                    .attr("x", 15)
                    .attr("dy", ".31em");

                svg.append("rect")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "overlaychart")
                    .attr("width", width)
                    .attr("height", height)
                    .style("cursor", "pointer")
                    .on("mouseover", function () {
                        focus.style("display", null);
                        focus2.style("display", null);
                    })
                    .on("mouseout", function () {
                        focus.style("display", "none");
                        focus2.style("display", "none");
                    })
                    .on("mousemove", mousemove)
                    .on("click", clicked);

                function mousemove() {
                    let x0 = x.invert(d3.mouse(this)[0]),
                        i = bisectDate(data, x0, 1),
                        d0 = data[i - 1],
                        d1 = data[i],
                        d = x0 - d0.year > d1.year - x0 ? d1 : d0,
                        i_2 = bisectDate(data2, x0, 1),
                        d0_2 = data2[i_2 - 1],
                        d1_2 = data2[i_2],
                        d_2 = x0 - d0_2.year > d1_2.year - x0 ? d1_2 : d0_2;
                    focus.attr("transform", "translate(" + x(d.year) + "," + y(d.amount) + ")");
                    focus.select("text").text(function () {
                        return d.amount;
                    });
                    focus.select(".x-hover-line").attr("y2", height - y(d.amount));

                    focus2.attr("transform", "translate(" + x(d_2.year) + "," + y(d_2.amount) + ")");
                    focus2.select("text").text(function () {
                        return d_2.amount;
                    });
                    focus2.select(".x-hover-line").attr("y2", height - y(d_2.amount));
                }

                function clicked() {
                    let x0 = x.invert(d3.mouse(this)[0]),
                        i = bisectDate(data, x0, 1),
                        d0 = data[i - 1],
                        d1 = data[i],
                        d = x0 - d0.year > d1.year - x0 ? d1 : d0;

                    let year = d.year.toString().split(" ")[3];

                    if(percentageMap1[year] > 0) {
                        $("#annual-growth").html(amountMap1[year] + " <span class='percentage' style=\"color: green\">(" + Math.abs(Number((percentageMap1[year]).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span>)</span>");
                    } else if(percentageMap1[year] < 0) {
                        $("#annual-growth").html(amountMap1[year] + " <span class='percentage' style=\"color: red\">(" + Math.abs(Number((percentageMap1[year]).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span>)</span>");
                    } else {
                        $("#annual-growth").html(amountMap1[year] + " <span class='percentage' style=\"color: black\">(" + Math.abs(Number((percentageMap1[year]).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span>)</span>");
                    }

                    if(percentageMap2[year] > 0) {
                        $("#annual-growth2").html(amountMap2[year] + " <span class='percentage' style=\"color: green\">(" + Math.abs(Number((percentageMap2[year]).toFixed(1))) + "%<span class='up glyphicon glyphicon-triangle-top'></span>)</span>");
                    } else if(percentageMap2[year] < 0) {
                        $("#annual-growth2").html(amountMap2[year] + " <span class='percentage' style=\"color: red\">(" + Math.abs(Number((percentageMap2[year]).toFixed(1))) + "%<span class='down glyphicon glyphicon-triangle-bottom'></span>)</span>");
                    } else {
                        $("#annual-growth2").html(amountMap2[year] + " <span class='percentage' style=\"color: black\">(" + Math.abs(Number((percentageMap2[year]).toFixed(1))) + "%<span class='even glyphicon glyphicon-minus'></span>)</span>");
                    }

                    $("#year-title").text(year);
                    $("#year-title2").text(year);
                }
            });
        }
    });
}