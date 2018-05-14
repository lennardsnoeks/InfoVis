(function() {
    var width = 1000,
        height = 1000;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)");

    var defs = svg.append("defs");

    d3.queue()
        .defer(d3.csv, "datasets/all-time.csv")
        .await(ready);

    var radiusScale = d3.scaleSqrt().domain([1,300]).range([5,110]);

    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide(function(d) {
            return radiusScale(d.amount) + 1;
        }));

    function ready (error, datapoints) {
        defs.selectAll(".land-pattern")
            .data(datapoints)
            .enter().append("pattern")
            .attr("class", "land-pattern")
            .attr("id", function(d) {
                return d.country
            })
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("height", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("xlink:href", function(d) {
                return "flags/" + d.country + '.svg'
            });

        var circles = svg.selectAll(".land")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "land")
            .style("stroke", "lightgray")
            .attr("r", function(d) {
                return radiusScale(d.amount)
            })
            .attr("fill", function(d) {
                return "url(#" + d.country + ")"
            })
            .on('click', function(d) {
                console.log(d)
            });

        simulation.nodes(datapoints)
            .on('tick', ticked);

        function ticked() {
            circles
                .attr("cx", function(d) {
                    return d.x
                })
                .attr("cy", function(d) {
                    return d.y
                })
        }

    }
})();