import * as d3 from "d3";

let model = {
    "nodes": [
        {"id":"G"}, // 0
        {"id":"1"},
        {"id":"2"},
        {"id":"3"},
        {"id":"4"},
        {"id":"5"},
        {"id":"6"},
        {"id":"7"},
        {"id":"8"},
        {"id":"9"},
        {"id":"10"},
        {"id":"11"},
        {"id":"12"},
        {"id":"13"},
        {"id":"14"},
        {"id":"15"},
        {"id":"16"},
        {"id":"17"},
        {"id":"18"},
        {"id":"19"},
        {"id":"20"},
        {"id":"21"},
        {"id":"22"},
        {"id":"23"},
        {"id":"24"},
        {"id":"25"},
        {"id":"26"},
        {"id":"27"},
        {"id":"28"},
        {"id":"29"},
        {"id":"A"}, //30
        {"id":"B"}, //31
        {"id":"C"}, //32
        {"id":"A'"},//33
        {"id":"B'"},//34
        {"id":"C'"} //35
    ],
    "links": [
        {"source": "G", "target": "1"},
        {"source": "G", "target": "10"},
        {"source": "G", "target": "19"},
        {"source": "A", "target": "13"},
        {"source": "B", "target": "21"},
        {"source": "C", "target": "24"},
        {"source": "A'", "target": "12"},
        {"source": "B'", "target": "3"},
        {"source": "C'", "target": "9"},

        {"source": "1", "target": "2"},
        {"source": "1", "target": "7"},
        {"source": "2", "target": "6"},
        {"source": "2", "target": "3"},
        {"source": "3", "target": "4"},
        {"source": "4", "target": "5"},
        {"source": "4", "target": "8"},

        {"source": "5", "target": "6"},
        {"source": "5", "target": "9"},

        {"source": "6", "target": "11"},

        {"source": "7", "target": "11"},
        {"source": "7", "target": "15"},

        {"source": "8", "target": "10"},

        {"source": "9", "target": "18"},

        {"source": "10", "target": "29"},

        {"source": "11", "target": "18"},

        {"source": "12", "target": "8"},
        {"source": "12", "target": "25"},

        {"source": "13", "target": "14"},
        {"source": "13", "target": "22"},

        {"source": "14", "target": "15"},
        {"source": "14", "target": "28"},

        {"source": "15", "target": "17"},

        {"source": "16", "target": "17"},
        {"source": "16", "target": "28"},

        {"source": "17", "target": "18"},

        {"source": "19", "target": "22"},
        {"source": "19", "target": "29"},

        {"source": "20", "target": "24"},
        {"source": "20", "target": "25"},
        {"source": "20", "target": "29"},

        {"source": "21", "target": "16"},
        {"source": "21", "target": "26"},

        {"source": "22", "target": "27"},

        {"source": "23", "target": "26"},

        {"source": "24", "target": "23"},
        {"source": "24", "target": "25"},

        {"source": "26", "target": "27"},

        {"source": "27", "target": "28"},
    ]
};

function dograph() {
    let canvas = d3.select("#container"),
        width = +canvas.attr("width"),
        height = +canvas.attr("height");

    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(0.7))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width/2, height/2));

    let link = canvas.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(model.links)
        .enter().append("line");

    let node = canvas.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(model.nodes)
        .enter().append("g");
    
    let labels = node.append("text")
        .text(function(d) { return d.id; })
        .attr('x', 6)
        .attr('y', 3)
    node.append("title")
        .text(function(d) { return d.id; });

    simulation.nodes(model.nodes).on("tick", ticked);

    simulation.force("link").links(model.links);
    
    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        
        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }


    function drawLink(d) {
        context.moveTo(d.source.x, d.source.y);
        context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(d) {
        context.moveTo(d.x + 3, d.y);
        context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    }
}

document.addEventListener("DOMContentLoaded", dograph);

// export { dograph as default };