// JS file containing code for generating confluent drawings


var svgRoute = d3.select("#routingGraph"),
    widthRoute = +svgRoute.attr("width"),
    heightRoute = +svgRoute.attr("height");

var simulationRoute = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(widthRoute / 2, heightRoute / 2));

function genRoutingGraph (pathToJsonFile) {
    console.log("inside genRouting");
    d3.json(pathToJsonFile, function (error, graph) {
        if (error) throw error;
    
        // Get the routing graph from the module data
        graphToRoutingGraph(graph, drawRoutingGraph);
    });
}

function graphToRoutingGraph(graph, cb) {
    var routingGraph = {};

    // Push the nodes
    routingGraph.nodes = graph.nodes;
    // mark each node as not routingNode
    routingGraph.nodes.forEach(function (elem) {
        elem.isRouting = false;
    });
    // console.log(graph.modules);

    graph.PGmodules.forEach(function (elem) {
        routingGraph.nodes.push({
            "id": elem.id,
            "isRouting": true
        }); // Each module is a routing node
    });

    // Push the edges
    routingGraph.links = graph.PGlinks;
    graph.PGmodules.forEach(function (elem) {
        // console.log(elem);
        var elemNodes = elem.elements.nodes;
        var elemModules = elem.elements.modules;

        // console.log(elemNodes);
        // Edges from current module to child nodes
        elemNodes.forEach(function (e) {
            routingGraph.links.push({
                "source": elem.id,
                "target": e
            });
        });

        // Edges from current module to child modules
        elemModules.forEach(function (e) {
            routingGraph.links.push({
                "source": elem.id,
                "target": e
            });
        });

    });

    var reverseEdges = [];
    routingGraph.links.forEach (function (link) {
        reverseEdges.push({
            "source": link.source,
            "target": link.target
        });
    });
    reverseEdges.forEach (function (edge) {
        routingGraph.links.push(edge);
    });

    // routingGraph.links.push({
    //     "source": "ran",
    //     "target": "na"
    // })
    // everything done
    cb(routingGraph);
}

function drawRoutingGraph(graph) {
    // draw the routing graph
    console.log(graph);
    var line = d3.radialLine()
        .curve(d3.curveBundle.beta(0.85))
        .radius(function (d) { return d.y; })
        .angle(function (d) { return d.x });

    // var link = svgRoute.append("g").selectAll(".links");
    // link = link
    //     .data(graph.links)
    //     .enter().append("path")
    //     .each(function (d) { d.source = d[0], d.target = d[d.length - 1]; })
    //     .attr("class", "links")
    //     .attr("d", line);

    var link = svgRoute.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");

    var node = svgRoute.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("fill", function (d) { return d.isRouting ? "#7EC0EE" : "#333333" })
        .attr("r", 4.5)
        .call(d3.drag()
            .on("start", dragstartedRoute)
            .on("drag", draggedRoute)
            .on("end", dragendedRoute));

    node.append("title")
        .text(function (d) { return d.id; });

    simulationRoute
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulationRoute.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }
}

function dragstartedRoute(d) {
    if (!d3.event.active) simulationRoute.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function draggedRoute(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragendedRoute(d) {
    if (!d3.event.active) simulationRoute.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}