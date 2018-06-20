let margin = {top: 20, right: 20, bottom: 30, left: 40};
let barChartWidth = 960 - margin.left - margin.right;
let barChartHeight = 500 - margin.top - margin.bottom;

var labelArea = 160;
var chart, width = 400, bar_height = 20;
var rightOffset = width + labelArea;

var lCol = "male";
var rCol = "female";

function updateBarChart(field) {
    d3.select("#bar-chart-id").remove();

    $.get('http://localhost:3000/gender/' + field, { }, function (data) {
        let height = bar_height * data.length;

        // Sort data on amount of male students
        data.sort(function(a,b) {return (a.male + a.female < b.male + b.female) ? 1 : ((b.male + b.female < a.male + a.female) ? -1 : 0);} );

        var scale = d3.scaleLinear()
            .range([0, width - 50]);
        var y = d3version3.scale.ordinal()
            .rangeBands([20, height]);

        var chart = d3.select("#bar-chart")
            .append('svg')
            .attr("id","bar-chart-id")
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
