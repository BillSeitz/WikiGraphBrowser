$(function() {

    var w = 900,
        h = 600,
        node,
        link,
        labels,
        root,
        linkIndexes,
        clicked_names,
        typeSize;

    function tick(e) {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        
        node.attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

        labels.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });
    }

    function color(d) {
        var c
        if (d.type === 'k') {
            c = '#0580F5';
        } else if (d.type === 'w') {
            c = '#c6dbef';
        } else {
            c = '#3182bd';
        }
        return c;
    }

    function nodesTypeSize(d) {
        var s;
        if (d.type === 'k') {
            s = 0.8;
        } else if (d.type === 'w') {
            s = 0.5;
        } else {
            s = 0.3;
        }
        return s;
    }

    typeSize = nodesTypeSize;

    function radius(d) {
        var r = typeSize(d) * 15;
        return r;
    }

    function charge(d, i) { 
        var r = typeSize(d);
        return -r * 1000;
    }

    function isConnected(a, b) {
        return linkIndexes[a.index + ',' + b.index] || a.index == b.index;
    }

    function fade(bo) { // bo = {True, False}, True mean to turn that node On (fade rest)
        return function(d) {
            var opacity = bo ? 0.2 : 1;
            var rad = radius(d);

            node.style('stroke-opacity', function(o) {
                thisOpac = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpac);
                return thisOpac;
            });

            link.style('stroke-opacity', function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });

            i = j = 0;
            if (!bo) { //bo=False - from mouseout
                //labels.select('text.label').remove();
                /*
                labels.forEach(function(o) {
                    if (!(d.name in clicked_names)) {
                        d.text.label.remove();
                    }
                }); */
                labels.filter(function(o) {
                    return (clicked_names.indexOf(o.name) < 0);
                    })
                    .text(function(o) { return ""; });
                    j++;

            }

            if (bo) { // from mouseover
                labels.filter(function(o) {
                        return isConnected(o, d);
                    })
                    .append('svg:text')
                    .style('fill', '#C17021')
                    .attr('text-anchor', 'middle')
                    .attr('class', 'label')
                    //.text(function(o) { return (o !== d) ? o.name.substr(0, 16) : ''; });
                    .text(function(o) { return o.name.substr(0, 16); }); //this turns on label
                    i++;

            }
        };
    }

    var force = d3.layout.force()
        .on('tick', tick)
        .size([w, h])
        .linkDistance(30)
        //.gravity(0.05)
        .charge(charge);

    var vis = d3.select('#chart').append('svg:svg')
        .attr('width', w)
        .attr('height', h);

    function searchnode(nname) {
        // alert(nname);
        // Load the json data
        clicked_names[clicked_names.length] = nname
        d3.json(u_root + nname + '.json', function(json) {
            for (var i = 0; i < json.nodes.length; i++) {
                var node = json.nodes[i];
                root.nodes.push(node);
            };
            for (var i = 0; i < json.links.length; i++) {
                var link = json.links[i];
                root.links.push(link);
            };
            update();
        });
    }

    function update() {
        // Hack the links struct
        if (typeof(node_hash) == 'undefined') {
            node_hash = [];
            next_node = 0;
        };

        // Create a hash that allows access to each node by its id
        var i;
        var j = Object.keys(node_hash).length
        for (i = root.nodes.length - 1; i >= j; i -= 1) {
            d = root.nodes[i];
            if (!node_hash[d.id]) {
            node_hash[d.id] = d;
            } else {
                root.nodes.splice(i, 1);
            }
        };
      
        // Append the source object node and the target object node to each link
        root.links.forEach(function(d, i) {
            if (typeof(d.source) != "object") {
				d.source = node_hash[d.source];
				d.target = node_hash[d.target];
            };
         });

        
        // Restart the force layout
        force
            .nodes(root.nodes)
            .links(root.links)
            .start();

        // Update the links
        link = vis.selectAll('link.link')
            .data(root.links);

        // Enter any new links
        link.enter().append('svg:line')
            .attr('class', 'link')
            .attr('source', function(d) { return d.source; })
            .attr('target', function(d) { return d.target; });

        // Exit any old links
        link.exit().remove();

        // Update the nodes
        node = vis.selectAll('circle.node')
            .data(root.nodes);
            
        // Enter any new nodes
        node.enter().append('svg:circle')
            .attr('class', 'node')
            .attr('id', function(d) {
                    return d.type + d.id;
                })
            .style('fill', color)
            .attr('r', radius)
            .on('mouseover', fade(true))
            .on('mouseout', fade(false))
            .on("click", function(d,i) { searchnode(d.name); })
            .call(force.drag);

        // Exit any old nodes
        node.exit().remove();

        // Build fast lookup of links
        linkIndexes = {};
        root.links.forEach(function(d) {
            linkIndexes[d.source.index + ',' + d.target.index] = 1;
            linkIndexes[d.target.index + ',' + d.source.index] = 1;
        });

        // Build labels
        labels = vis.selectAll('g.labelParent')
            .data(root.nodes);

        labels.enter().append('svg:g')
            .attr('class', 'labelParent');

        labels.exit().remove();

        // Init fade state
        //node.each(fade(false));


    }

    // Load the json data
    clicked_names = ["FractallyGenerativePatternLanguage", "MakingALiving", "MeaningfulLife", "EconomicTransition"]
    d3.json('js/input_graph.json', function(json) {
        root = json;
        update();
    });

});
