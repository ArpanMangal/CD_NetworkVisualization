// var powergraphgridlayout;

// function drawPG(pathToJsonFile, powergraphgridlayout) {
//     var width = 700, height = 350;
//     var color = d3.scaleOrdinal(d3.schemeCategory20);
//     var makeEdgeBetween;
//     var colans = cola;
//     var graphfile = pathToJsonFile;//"graphdata/n7e23.json";
//     function makeSVG() {
//         var outer = d3.select("body").append("svg").attr("width", width).attr("height", height).attr("pointer-events", "all");
//         // define arrow markers for graph links
//         outer.append('svg:defs').append('svg:marker').attr('id', 'end-arrow').attr('viewBox', '0 -5 10 10').attr('refX', 5).attr('markerWidth', 3).attr('markerHeight', 3).attr('orient', 'auto').append('svg:path').attr('d', 'M0,-5L10,0L0,5L2,0').attr('stroke-width', '0px').attr('fill', '#555');
//         var zoomBox = outer.append('rect').attr('class', 'background').attr('width', "100%").attr('height', "100%");
//         var vis = outer.append('g');
//         var redraw = function (transition) { return (transition ? vis.transition() : vis).attr("transform", "translate(" + zoom.translate() + ") scale(" + zoom.scale() + ")"); };
//         vis.zoomToFit = function () {
//             var b = cola.vpsc.Rectangle.empty();
//             vis.selectAll("rect").each(function (d) {
//                 var bb = this.getBBox();
//                 b = b.union(new cola.vpsc.Rectangle(bb.x, bb.x + bb.width, bb.y, bb.y + bb.height));
//             });
//             var w = b.width(), h = b.height();
//             var cw = Number(outer.attr("width")), ch = Number(outer.attr("height"));
//             var s = Math.min(cw / w, ch / h);
//             var tx = (-b.x * s + (cw / s - w) * s / 2), ty = (-b.y * s + (ch / s - h) * s / 2);
//             zoom.translate([tx, ty]).scale(s);
//             redraw(true);
//         };
//         var zoom = d3.zoom();
//         zoomBox.call(zoom.on("zoom", redraw)).on("dblclick.zoom", vis.zoomToFit);
//         return vis;
//     }
//     function createLabels(svg, graph, node, d3cola, margin) {
//         var labelwidth = 0, labelheight = 0;
//         var labels = svg.selectAll(".label").data(graph.nodes).enter().append("text").attr("class", "label").text(function (d) { return d.name; }).call(d3cola.drag).each(function (d) {
//             var bb = this.getBBox();
//             labelwidth = Math.max(labelwidth, bb.width);
//             labelheight = Math.max(labelheight, bb.height);
//         });
//         node.attr("width", labelwidth).each(function (d) {
//             d.width = labelwidth + 2 * margin + 10;
//             d.height = labelheight + 2 * margin;
//         });
//         node.append("title").text(function (d) { return d.name; });
//         return labels;
//     }
//     function flatGraph() {
//         var d3cola = colans.d3adaptor().linkDistance(80).avoidOverlaps(true).size([width, height]);
//         var svg = makeSVG();
//         d3.json(graphfile, function (error, graph) {
//             var link = svg.selectAll(".link").data(graph.links).enter().append("line").attr("class", "link");
//             var margin = 10;
//             var node = svg.selectAll(".node").data(graph.nodes).enter().append("rect").attr("class", "node").attr("rx", 4).attr("ry", 4).call(d3cola.drag);
//             var label = createLabels(svg, graph, node, d3cola, margin);
//             d3cola.convergenceThreshold(0.1).nodes(graph.nodes).links(graph.links).start(10, 10, 10);
//             d3cola.on("tick", function () {
//                 node.each(function (d) { return d.innerBounds = d.bounds.inflate(-margin); });
//                 link.each(function (d) {
//                     cola.vpsc.makeEdgeBetween(d, d.source.innerBounds, d.target.innerBounds, 5);
//                     if (isIE())
//                         this.parentNode.insertBefore(this, this);
//                 });
//                 link.attr("x1", function (d) { return d.sourceIntersection.x; }).attr("y1", function (d) { return d.sourceIntersection.y; }).attr("x2", function (d) { return d.arrowStart.x; }).attr("y2", function (d) { return d.arrowStart.y; });
//                 node.attr("x", function (d) { return d.innerBounds.x; }).attr("y", function (d) { return d.innerBounds.y; }).attr("width", function (d) { return d.innerBounds.width(); }).attr("height", function (d) { return d.innerBounds.height(); });
//                 var b;
//                 label.each(function (d) {
//                     b = this.getBBox();
//                 }).attr("x", function (d) { return d.x; }).attr("y", function (d) {
//                     return d.y + b.height / 3;
//                 });
//                 //svg.zoomToFit();
//             }).on("end", function () {
//                 svg.zoomToFit();
//             });
//         });
//     }
//     function expandGroup(g, ms) {
//         if (g.groups) {
//             g.groups.forEach(function (cg) { return expandGroup(cg, ms); });
//         }
//         if (g.leaves) {
//             g.leaves.forEach(function (l) {
//                 ms.push(l.index + 1);
//             });
//         }
//     }
//     function getId(v, n) {
//         return (typeof v.index === 'number' ? v.index : v.id + n) + 1;
//     }

//     function isIE() {
//         return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
//     }
//     flatGraph();
//     // d3.select("#GridButton").on("click", powerGraph);
//     d3.select("#filemenu").on("change", function () {
//         d3.selectAll("svg").remove();
//         graphfile = this.value;
//         flatGraph();
//     });
//     function powerGraph2() {
//         var d3cola = colans.d3adaptor().jaccardLinkLengths(10, 0.5).avoidOverlaps(true).size([width, height]);
//         var svg = makeSVG();
//         d3.json(pathToJsonFile, function (error, graph) {
//             var powerGraph;
//             d3cola.nodes(graph.nodes).links(graph.links).powerGraphGroups(function (d) {
//                 powerGraph = d;
//                 powerGraph.groups.forEach(function (v) {
//                     v.padding = 20;
//                 });
//             }).start(10, 10, 10);
//             var group = svg.selectAll(".group").data(powerGraph.groups).enter().append("rect").attr("rx", 8).attr("ry", 8).attr("class", "group").style("fill", function (d, i) {
//                 return color(i);
//             });
//             var link = svg.selectAll(".link").data(powerGraph.powerEdges).enter().append("line").attr("class", "link");
//             var margin = 10;
//             var node = svg.selectAll(".node").data(graph.nodes).enter().append("rect").attr("class", "node").attr("width", function (d) {
//                 return d.width + 2 * margin;
//             }).attr("height", function (d) {
//                 return d.height + 2 * margin;
//             }).attr("rx", 4).attr("ry", 4).call(d3cola.drag);
//             var label = svg.selectAll(".label").data(graph.nodes).enter().append("text").attr("class", "label").text(function (d) {
//                 return d.name;
//             }).call(d3cola.drag);
//             node.append("title").text(function (d) {
//                 return d.name;
//             });
//             d3cola.on("tick", function () {
//                 node.each(function (d) {
//                     d.innerBounds = d.bounds.inflate(-margin);
//                 });
//                 group.each(function (d) {
//                     d.innerBounds = d.bounds.inflate(-margin);
//                 });
//                 link.each(function (d) {
//                     cola.vpsc.makeEdgeBetween(d, d.source.innerBounds, d.target.innerBounds, 5);
//                     if (isIE())
//                         this.parentNode.insertBefore(this, this);
//                 });
//                 link.attr("x1", function (d) {
//                     return d.sourceIntersection.x;
//                 }).attr("y1", function (d) {
//                     return d.sourceIntersection.y;
//                 }).attr("x2", function (d) {
//                     return d.arrowStart.x;
//                 }).attr("y2", function (d) {
//                     return d.arrowStart.y;
//                 });
//                 node.attr("x", function (d) {
//                     return d.innerBounds.x;
//                 }).attr("y", function (d) {
//                     return d.innerBounds.y;
//                 }).attr("width", function (d) {
//                     return d.innerBounds.width();
//                 }).attr("height", function (d) {
//                     return d.innerBounds.height();
//                 });
//                 group.attr("x", function (d) {
//                     return d.innerBounds.x;
//                 }).attr("y", function (d) {
//                     return d.innerBounds.y;
//                 }).attr("width", function (d) {
//                     return d.innerBounds.width();
//                 }).attr("height", function (d) {
//                     return d.innerBounds.height();
//                 });
//                 label.attr("x", function (d) {
//                     return d.x;
//                 }).attr("y", function (d) {
//                     var h = this.getBBox().height;
//                     return d.y + h / 3.5;
//                 });
//             });
//             // console.log(powerGraph);

//             // // Get PG Modules
//             // var modules = [];
//             // powerGraph.groups.forEach(function (group) {
//             //     // group is an object

//             //     // add the current module
//             //     modules.push({
//             //         "id": "Group" + group.id,
//             //         "elements": {
//             //             "nodes": [],
//             //             "modules": []
//             //         }
//             //     });

//             //     // add the child nodes
//             //     group.leaves.forEach(function (leaf) {
//             //         modules[modules.length - 1].elements.nodes.push("" + leaf.name);
//             //     });

//             //     // add the child modules
//             //     // console.log(group);
//             //     if (group.groups) {
//             //         group.groups.forEach(function (childGrp) {
//             //             modules[modules.length - 1].elements.modules.push("Group" + childGrp.id);
//             //         });
//             //     };
//             // });

//             // // console.log(modules);
//         //     moduleData.PGmodules = modules;


//         //     // Get PG Links
//         //     var PGlinks = [];
//         //     powerGraph.powerEdges.forEach (function (Pedge) {
//         //         // add the power edge to PGlinks
//         //         PGlinks.push ({
//         //             "source": Pedge.source.name || ("Group" + Pedge.source.id),
//         //             "target": Pedge.target.name || ("Group" + Pedge.target.id)
//         //         });
//         //     });

//         //     // console.log(PGlinks);
//         //     moduleData.PGlinks = PGlinks;
//         });
//     }
//     powerGraph2();

//     // console.log(powergraphgridlayout);
//     // console.log(iter++);

//     // console.log(powerGraph.groups);
//     // function getGroupts
// }
// // ("graphdata/n7e23.json", powergraphgridlayout || (powergraphgridlayout = {}));
// //# sourceMappingURL=powergraphgridlayout.js.map
// console.log('hi');


var powergraphgridlayout;
function drawPG(pathToJsonFile, powergraphgridlayout) {
    var width = 700, height = 350;
    var color = d3.scale.category20();
    var makeEdgeBetween;
    var colans = cola;
    var graphfile = pathToJsonFile;
    function makeSVG() {
        var outer = d3.select("body").append("svg").attr("width", width).attr("height", height).attr("pointer-events", "all");
        // define arrow markers for graph links
        outer.append('svg:defs').append('svg:marker').attr('id', 'end-arrow').attr('viewBox', '0 -5 10 10').attr('refX', 5).attr('markerWidth', 3).attr('markerHeight', 3).attr('orient', 'auto').append('svg:path').attr('d', 'M0,-5L10,0L0,5L2,0').attr('stroke-width', '0px').attr('fill', '#555');
        var zoomBox = outer.append('rect').attr('class', 'background').attr('width', "100%").attr('height', "100%");
        var vis = outer.append('g');
        var redraw = function (transition) { return (transition ? vis.transition() : vis).attr("transform", "translate(" + zoom.translate() + ") scale(" + zoom.scale() + ")"); };
        vis.zoomToFit = function () {
            var b = cola.vpsc.Rectangle.empty();
            vis.selectAll("rect").each(function (d) {
                var bb = this.getBBox();
                b = b.union(new cola.vpsc.Rectangle(bb.x, bb.x + bb.width, bb.y, bb.y + bb.height));
            });
            var w = b.width(), h = b.height();
            var cw = Number(outer.attr("width")), ch = Number(outer.attr("height"));
            var s = Math.min(cw / w, ch / h);
            var tx = (-b.x * s + (cw / s - w) * s / 2), ty = (-b.y * s + (ch / s - h) * s / 2);
            zoom.translate([tx, ty]).scale(s);
            redraw(true);
        };
        var zoom = d3.behavior.zoom();
        zoomBox.call(zoom.on("zoom", redraw)).on("dblclick.zoom", vis.zoomToFit);
        return vis;
    }
    function createLabels(svg, graph, node, d3cola, margin) {
        var labelwidth = 0, labelheight = 0;
        var labels = svg.selectAll(".label").data(graph.nodes).enter().append("text").attr("class", "label").text(function (d) { return d.name; }).call(d3cola.drag).each(function (d) {
            var bb = this.getBBox();
            labelwidth = Math.max(labelwidth, bb.width);
            labelheight = Math.max(labelheight, bb.height);
        });
        node.attr("width", labelwidth).each(function (d) {
            d.width = labelwidth + 2 * margin + 10;
            d.height = labelheight + 2 * margin;
        });
        node.append("title").text(function (d) { return d.name; });
        return labels;
    }
    function flatGraph() {
        var d3cola = colans.d3adaptor().linkDistance(80).avoidOverlaps(true).size([width, height]);
        var svg = makeSVG();
        d3.json(graphfile, function (error, graph) {
            var link = svg.selectAll(".link").data(graph.links).enter().append("line").attr("class", "link");
            var margin = 10;
            var node = svg.selectAll(".node").data(graph.nodes).enter().append("rect").attr("class", "node").attr("rx", 4).attr("ry", 4).call(d3cola.drag);
            var label = createLabels(svg, graph, node, d3cola, margin);
            d3cola.convergenceThreshold(0.1).nodes(graph.nodes).links(graph.links).start(10, 10, 10);
            d3cola.on("tick", function () {
                node.each(function (d) { return d.innerBounds = d.bounds.inflate(-margin); });
                link.each(function (d) {
                    cola.vpsc.makeEdgeBetween(d, d.source.innerBounds, d.target.innerBounds, 5);
                    if (isIE())
                        this.parentNode.insertBefore(this, this);
                });
                link.attr("x1", function (d) { return d.sourceIntersection.x; }).attr("y1", function (d) { return d.sourceIntersection.y; }).attr("x2", function (d) { return d.arrowStart.x; }).attr("y2", function (d) { return d.arrowStart.y; });
                node.attr("x", function (d) { return d.innerBounds.x; }).attr("y", function (d) { return d.innerBounds.y; }).attr("width", function (d) { return d.innerBounds.width(); }).attr("height", function (d) { return d.innerBounds.height(); });
                var b;
                label.each(function (d) {
                    b = this.getBBox();
                }).attr("x", function (d) { return d.x; }).attr("y", function (d) {
                    return d.y + b.height / 3;
                });
                //svg.zoomToFit();
            }).on("end", function () {
                svg.zoomToFit();
            });
        });
    }
    function expandGroup(g, ms) {
        if (g.groups) {
            g.groups.forEach(function (cg) { return expandGroup(cg, ms); });
        }
        if (g.leaves) {
            g.leaves.forEach(function (l) {
                ms.push(l.index + 1);
            });
        }
    }
    function getId(v, n) {
        return (typeof v.index === 'number' ? v.index : v.id + n) + 1;
    }
    function powerGraph() {
        var d3cola = colans.d3adaptor().convergenceThreshold(0.01).linkDistance(80).handleDisconnected(false).avoidOverlaps(true).size([width, height]);
        var svg = makeSVG();
        d3.json(graphfile, function (error, graph) {
            graph.nodes.forEach(function (v, i) {
                v.index = i;
            });
            var powerGraph;
            var doLayout = function (response) {
                var group = svg.selectAll(".group").data(powerGraph.groups).enter().append("rect").attr("rx", 8).attr("ry", 8).attr("class", "group").style("fill", function (d, i) { return color(i); });
                var link = svg.selectAll(".link").data(powerGraph.powerEdges).enter().append("line").attr("class", "link");
                var margin = 10;
                var node = svg.selectAll(".node").data(graph.nodes).enter().append("rect").attr("class", "node").attr("width", function (d) { return d.width + 2 * margin; }).attr("height", function (d) { return d.height + 2 * margin; }).attr("rx", 4).attr("ry", 4).call(d3cola.drag);
                var label = createLabels(svg, graph, node, d3cola, margin);
                var vs = response.nodes.filter(function (v) { return v.label; });
                vs.forEach(function (v) {
                    var index = Number(v.label) - 1;
                    var node = graph.nodes[index];
                    node.x = Number(v.x) * node.width / 80 + 50;
                    node.y = Number(v.y) / 1.2 + 50;
                    node.fixed = 1;
                });
                d3cola.start(1, 1, 1);
                d3cola.on("tick", function () {
                    node.each(function (d) {
                        d.bounds.setXCentre(d.x);
                        d.bounds.setYCentre(d.y);
                        d.innerBounds = d.bounds.inflate(-margin);
                    });
                    group.each(function (d) { return d.innerBounds = d.bounds.inflate(-margin); });
                    link.each(function (d) {
                        cola.vpsc.makeEdgeBetween(d, d.source.innerBounds, d.target.innerBounds, 5);
                        if (isIE())
                            this.parentNode.insertBefore(this, this);
                    });
                    link.attr("x1", function (d) { return d.sourceIntersection.x; }).attr("y1", function (d) { return d.sourceIntersection.y; }).attr("x2", function (d) { return d.arrowStart.x; }).attr("y2", function (d) { return d.arrowStart.y; });
                    node.attr("x", function (d) { return d.innerBounds.x; }).attr("y", function (d) { return d.innerBounds.y; }).attr("width", function (d) { return d.innerBounds.width(); }).attr("height", function (d) { return d.innerBounds.height(); });
                    group.attr("x", function (d) { return d.innerBounds.x; }).attr("y", function (d) { return d.innerBounds.y; }).attr("width", function (d) { return d.innerBounds.width(); }).attr("height", function (d) { return d.innerBounds.height(); });
                    label.attr("x", function (d) { return d.x; }).attr("y", function (d) {
                        var h = this.getBBox().height;
                        return d.y + h / 3.5;
                    });
                }).on("end", function () { return svg.zoomToFit(); });
            };
            d3cola.nodes(graph.nodes).links(graph.links).powerGraphGroups(function (d) { return (powerGraph = d).groups.forEach(function (v) { return v.padding = 10; }); });
            var modules = { N: graph.nodes.length, ms: [], edges: [] };
            var n = modules.N;
            powerGraph.groups.forEach(function (g) {
                var m = [];
                expandGroup(g, m);
                modules.ms.push(m);
            });
            powerGraph.powerEdges.forEach(function (e) {
                var N = graph.nodes.length;
                modules.edges.push({ source: getId(e.source, N), target: getId(e.target, N) });
            });
            if (document.URL.toLowerCase().indexOf('marvl.infotech.monash.edu') >= 0) {
                $.ajax({
                    type: 'post',
                    url: 'http://marvl.infotech.monash.edu/cgi-bin/test.py',
                    data: JSON.stringify(modules),
                    datatype: "json",
                    success: function (response) {
                        doLayout(response);
                    },
                    error: function (jqXHR, status, err) {
                        alert(status);
                    }
                });
            }
            else {
                d3.json(graphfile.replace(/.json/, 'pgresponse.json'), function (error, response) {
                    doLayout(response);
                });
            }
        });
    }
    function isIE() {
        return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
    }
    flatGraph();
    d3.select("#GridButton").on("click", powerGraph);
    d3.select("#filemenu").on("change", function () {
        d3.selectAll("svg").remove();
        graphfile = this.value;
        flatGraph();
    });
    function powerGraph2() {
        var d3cola = colans.d3adaptor().jaccardLinkLengths(10, 0.5).avoidOverlaps(true).size([width, height]);
        var svg = makeSVG();
        d3.json(pathToJsonFile, function (error, graph) {
            var powerGraph;
            d3cola.nodes(graph.nodes).links(graph.links).powerGraphGroups(function (d) {
                powerGraph = d;
                powerGraph.groups.forEach(function (v) {
                    v.padding = 20;
                });
            }).start(10, 10, 10);
            var group = svg.selectAll(".group").data(powerGraph.groups).enter().append("rect").attr("rx", 8).attr("ry", 8).attr("class", "group").style("fill", function (d, i) {
                return color(i);
            });
            var link = svg.selectAll(".link").data(powerGraph.powerEdges).enter().append("line").attr("class", "link");
            var margin = 10;
            var node = svg.selectAll(".node").data(graph.nodes).enter().append("rect").attr("class", "node").attr("width", function (d) {
                return d.width + 2 * margin;
            }).attr("height", function (d) {
                return d.height + 2 * margin;
            }).attr("rx", 4).attr("ry", 4).call(d3cola.drag);
            var label = svg.selectAll(".label").data(graph.nodes).enter().append("text").attr("class", "label").text(function (d) {
                return d.name;
            }).call(d3cola.drag);
            node.append("title").text(function (d) {
                return d.name;
            });
            d3cola.on("tick", function () {
                node.each(function (d) {
                    d.innerBounds = d.bounds.inflate(-margin);
                });
                group.each(function (d) {
                    d.innerBounds = d.bounds.inflate(-margin);
                });
                link.each(function (d) {
                    cola.vpsc.makeEdgeBetween(d, d.source.innerBounds, d.target.innerBounds, 5);
                    if (isIE())
                        this.parentNode.insertBefore(this, this);
                });
                link.attr("x1", function (d) {
                    return d.sourceIntersection.x;
                }).attr("y1", function (d) {
                    return d.sourceIntersection.y;
                }).attr("x2", function (d) {
                    return d.arrowStart.x;
                }).attr("y2", function (d) {
                    return d.arrowStart.y;
                });
                node.attr("x", function (d) {
                    return d.innerBounds.x;
                }).attr("y", function (d) {
                    return d.innerBounds.y;
                }).attr("width", function (d) {
                    return d.innerBounds.width();
                }).attr("height", function (d) {
                    return d.innerBounds.height();
                });
                group.attr("x", function (d) {
                    return d.innerBounds.x;
                }).attr("y", function (d) {
                    return d.innerBounds.y;
                }).attr("width", function (d) {
                    return d.innerBounds.width();
                }).attr("height", function (d) {
                    return d.innerBounds.height();
                });
                label.attr("x", function (d) {
                    return d.x;
                }).attr("y", function (d) {
                    var h = this.getBBox().height;
                    return d.y + h / 3.5;
                });
            });
        });
    }
    powerGraph2();
};
//# sourceMappingURL=powergraphgridlayout.js.map
console.log('hi');