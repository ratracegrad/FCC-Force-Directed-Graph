$(document).ready(function() {
    var width = 900,
        height = 900;

    var color = d3.scale.category20();

    var force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([width, height]);

    var svg = d3.select(".chart").append("svg")
            .attr("width", width)
            .attr("height", height);

    var tooltip = d3.select('.tooltip');
    
    d3.json("countries.json", function(error, graph) {
        if (error) throw error;

        force
                .nodes(graph.nodes)
                .links(graph.links)
                .start();

        var link = svg.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return 1; });

        var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", 5)
                .style("fill", function(d) { return color(d.code); })
                .on('mouseover', function(d) {
                    tooltip.style("display", "block");
                    tooltip.html(d.country)
                            .style("left", d3.event.pageX + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                })
                .on('mouseout', function(d) {
                    tooltip.style("display", "none");
                })
                .call(force.drag);

        node.append("title")
                .text(function(d) { return d.country; });

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
        });
    });
});