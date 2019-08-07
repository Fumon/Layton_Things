import * as d3 from "d3";

import noUiSlider from "nouislider"
import 'nouislider/distribute/nouislider.css';
import { S_IFDIR } from "constants";

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
    
    node.append("circle")
        .attr("r", (d) => {
            if(isNaN(d.id)) {
                return 7;
            } else {
                return 4;
            }
        });
    
    let labels = node.append("text")
        .text(function(d) { return d.id; })
        .attr('x', 6)
        .attr('y', 3)
    node.append("title")
        .text(function(d) { return d.id; });

    function h(set, min, max, step){ 
        if(step === undefined) {
            step = 0.1;
        }
        return {s:set, min:min, max:max, step:step};
    };
    
    let sset = {
        "link": {
            "iterations": h(1, 1, 30, 1),
            "distance": h(30, 0, 800, 5),
            "strength": h(0.7, -5, 5)
        },
        "charge": {
            "distanceMin": h(90, 1, 500, 5),
            "distanceMax": h(120, 2, 1000, 5),
            "strength": h(-30, -5000, 5000, 10),
            "theta": h(0.3, 0, 1, 0.05)
        }
    }

    let linkForce = d3.forceLink(model.links).id((d) => d.id)
        .iterations(sset.link.iterations.s)
        .distance(sset.link.distance.s)
        .strength(sset.link.strength.s);

    let chargeForce = d3.forceManyBody()
        .distanceMin(sset.charge.distanceMin.s)
        .distanceMax(sset.charge.distanceMax.s)
        .strength(sset.charge.strength.s)
        .theta(sset.charge.theta.s);
    
    let simulation = d3.forceSimulation(model.nodes)
        .force("link", linkForce)
        .force("charge", chargeForce)
        .force("centering", d3.forceCenter(width/2, height/2))
        .alphaDecay(0);
    

    // Generate sliders
    // text helper
    function header(n, t) {
        var g = document.createElement("h" + n);
        g.appendChild(document.createTextNode(t));
        return g;
    };

    // Bind to 

    const sliderDiv = document.getElementById("sliders");
    sliderDiv.appendChild(header(2, "Settings"));
    for (var type in sset) {
        sliderDiv.appendChild(header(3, type));
        var settingDiv = document.createElement("div");
        sliderDiv.appendChild(settingDiv);
        for (var setting in sset[type]) {
            var vals = sset[type][setting];
            var range = document.createElement("div");
            settingDiv.appendChild(range);
            var sld = noUiSlider.create(range, {
                range: {
                    "min": vals.min,
                    "max": vals.max
                },

                step: vals.step,
                start: vals.s,

                tooltips: true,
            });

            var cal = function() {
                return (vals) => {
                    console.log(+vals[0])
                    simulation.force(type).call(setting, +vals[0]);
                    simulation.alpha(1);
                }
            }();
            sld.on("set", cal);

            var span = document.createElement("span");
            span.appendChild(document.createTextNode(setting));
            settingDiv.appendChild(span);
        }
    }

    simulation.on("tick", () => {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        
        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    });
}

document.addEventListener("DOMContentLoaded", dograph);

// export { dograph as default };