// Author:  Jeff Crossman
//			http://www.jeffcrossman.com
//   Date: 	4 March 2014
// Completed as part of Golan Levin's Interactive Art
// and Computational Design course at Carnegie Mellon
// University. Spring 2014

var UPDATE_RATE = 200;
var boystring, girlstring;
var data;
var dataloop;
var dataitem = 0;
var w = 960;
var h = 500;
var w2 = w/2;
var h2 = h/2;
var nodes = [];
var links = [];
var canvas;
var canvasctx;
var cont;
var vis;
var force;
var boy;
var girl;
var distance = 500;
var rotation = 0; 			// Rotation translation in degrees
var linearSpeed = 0.25;		// Linear speed at baseline distance of 15 (hertz)
var datetext;
var distancetext;


window.onload = function() {
	window.onresize = OnWindowResize;
	OnWindowResize();

	canvas = document.getElementById("mainCanvas");
	canvasctx = canvas.getContext("2d");

	cont = d3.select("#mainSVG");
	vis = cont.append("g");

	boystring = new LightString;
	girlstring = new LightString;

	force = d3.layout.force()
	    .nodes(nodes)
	    .links(links)
	    .linkDistance(distance)
	    .linkStrength(1)
	    .size([w, h]);

	force.on("tick", function(e) {
		var rots = "translate(" + w2 + "," + h2 + ")rotate(" + rotation + ")translate(" + (-w2) + "," + (-h2) + ")";
	  	vis.selectAll("path")
	    	.attr("transform", function(d) { return rots + "translate(" + d.x + "," + d.y + ")"; })

	   	moveLightStrings(rotation);
	});

	boy = {	id: "boy",
	    	type: "circle",
	    	color: "#2354ee",
	    	size: 200,
	    	x: w2 - 20,
	    	y: h2
	};

	girl = { id: "girl",
	    	 type: "circle",
	    	 color: "#ff15c5",
	    	 size: 200,
	    	 x: w2 + 20,
	    	 y: h2
	};

	nodes.push(boy, girl)
	links.push({source: boy, target: girl});

	// Load in distance data
	d3.json("distances.json", function(error, json) {
		if (error) return console.warn(error);
		data = json;
	});

	boystring.initialize('boy');
	girlstring.initialize('girl');

	vis.selectAll("path")
	    .data(nodes)
	    .enter().append("path")
	      .attr("class", function(d) { return d.id; })
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	      .style("z-index", 99)
	      .attr("d", d3.svg.symbol()
	        .size(function(d) { return d.size; })
	        .type(function(d) { return d.type; }))
	      	.style("fill", function(d) { return d.color; })
	      	.style("stroke", function(d) { return d.color; })
	      	.style("stroke-width", "1.5px");

	tellStory();
}

function tellStory() {
	var boyintro = vis.append("text")
		.attr("x", w2 - 215)
		.attr("y", h2 - 50)
		.text( "There once was a boy")
		.attr("font-family", "sans-serif")
		.attr("font-size", "20px")
		.attr("fill", "#2354ee")
		.attr("opacity", 0);

	var girlintro = vis.append("text")
		.attr("x", w2 + 20)
		.attr("y", h2 + 50)
		.text( "and a girl")
		.attr("font-family", "sans-serif")
		.attr("font-size", "20px")
		.attr("fill", "#ff15c5")
		.attr("opacity", 0);

	var loveintro = vis.append("text")
		.attr("x", w2 - 58)
		.attr("y", h2 + 50)
		.text( "madly in love")
		.attr("font-family", "sans-serif")
		.attr("font-size", "20px")
		.attr("fill", "#ffffff")
		.attr("opacity", 0);

	var coordintro = vis.append("text")
		.attr("x", w2 - 226)
		.attr("y", h2 - 50)
		.text( "who collected their distance apart every 30 minutes")
		.attr("font-family", "sans-serif")
		.attr("font-size", "20px")
		.attr("fill", "#ffffff")
		.attr("opacity", 0);

	var minintro = vis.append("text")
		.attr("x", w2 - 61)
		.attr("y", h2 + 50)
		.text( "for one month")
		.attr("font-family", "sans-serif")
		.attr("font-size", "20px")
		.attr("fill", "#ffffff")
		.attr("opacity", 0);

	datetext = vis.append("text")
		.attr("x", 25)
		.attr("y", h - 25 - 19)
		.text( "date: January 29 2014")
		.attr("font-family", "sans-serif")
		.attr("font-size", "14px")
		.attr("fill", "#ffffff")
		.attr("opacity", 0);

	distancetext = vis.append("text")
		.attr("x", 25)
		.attr("y", h - 25)
		.text( "distance: 0.0 kilometers")
		.attr("font-family", "sans-serif")
		.attr("font-size", "14px")
		.attr("fill", "#ffffff")
		.attr("opacity", 0);


	boyintro.transition().delay(250).duration(1500).ease("linear").attr("opacity", 1);
	boyintro.transition().delay(3500).duration(500).ease("linear").attr("opacity", 0);

	girlintro.transition().delay(2000).duration(1000).ease("linear").attr("opacity", 1);
	girlintro.transition().delay(3500).duration(500).ease("linear").attr("opacity", 0);

	loveintro.transition().delay(4250).duration(1500).ease("linear").attr("opacity", 1);
	loveintro.transition().delay(5750).duration(1000).ease("linear").attr("opacity", 0);

	coordintro.transition().delay(7250).duration(1500).ease("linear").attr("opacity", 1);
	coordintro.transition().delay(10250).duration(1000).ease("linear").attr("opacity", 0);

	minintro.transition().delay(8750).duration(1500).ease("linear").attr("opacity", 1);
	minintro.transition().delay(10250).duration(1000).ease("linear").attr("opacity", 0);

	datetext.transition().delay(10750).duration(1500).ease("linear").attr("opacity", 1);

	distancetext.transition().delay(10750).duration(1500).ease("linear").attr("opacity", 1);

	setTimeout(run, 12250);
}

function run() {
	setInterval(drawLightStrings, 1000/UPDATE_RATE);
	setInterval(acceleratePoints, 1000/UPDATE_RATE);
	dataloop = setInterval(loop, 100);
}

function moveLightStrings (deg) {
	// Move & Draw strings
	var tp = Translate(boy.x, boy.y, deg, w2, h2);
	boystring.move(tp[0], tp[1]);

	tp = Translate(girl.x, girl.y, deg, w2, h2);
	girlstring.move(tp[0], tp[1]);
}

function drawLightStrings() {
	// Clear Canvas
	canvasctx.globalCompositeOperation = "source-over";
 	canvasctx.fillStyle = "rgba(8,8,12,0.9)";
	canvasctx.fillRect(0, 0, w, h);
	canvasctx.globalCompositeOperation = "lighter";

	boystring.draw();
	girlstring.draw();
}

function acceleratePoints() {
	rotation += linearSpeed * (2 * Math.PI) * (7.5 / (0.5 * distance)) * (360 / UPDATE_RATE);

	if (distance <= 17){
		// We're close, Accelerate Points
		linearSpeed += 0.005;
	}
	else {
		// We're far away, Decellerate Points
		linearSpeed -= 0.000001;
	}

	// Clamps
	if (linearSpeed > 5){
		linearSpeed = 5;
	}
	else if(linearSpeed < 0.25){
		linearSpeed = 0.25;
	}

}

function loop() {
	if (data != undefined && dataitem < data.length) {
		distancetext.text( "distance: " + Math.round(data[dataitem]['distance']*10)/10 + " kilometers")
		datetext.text( "date: " + moment(new Date(data[dataitem]['time']*1000).toISOString()).format('LL') )
	 	distance = data[dataitem]['distance'] * 50;
		if (distance > 500)
			distance = 500;
		if (distance < 15)
			distance = 15;

		force.linkDistance(distance);
		force.start();
		dataitem++;
	}
	else if (data != undefined && dataitem == data.length){
		//force.linkDistance(15);
		//force.start();
		dataitem++;
		force.stop();
		var rots = "translate(" + w2 + "," + h2 + ")rotate(" + rotation + rotation%360 + ")translate(" + (-w2) + "," + (-h2) + ")";
	  	vis.selectAll("path")
	  		.transition()
	  		.delay(250)
	  		.duration(250)
	  		.ease("linear")
	    	.attr("transform", function(d) { return rots + "translate(" + d.x + "," + d.y + ")"; });

	    var theend = vis.append("text")
			.attr("x", w2 - 33)
			.attr("y", h2 + 50)
			.text( "the end")
			.attr("font-family", "sans-serif")
			.attr("font-size", "20px")
			.attr("fill", "#ffffff")
			.attr("opacity", 0)
			.transition()
			.delay(250)
			.duration(1500)
			.ease("linear")
			.attr("opacity", 1);
	}
	else {
		// Restart
	}
}

function Translate(x, y, d, ox, oy) {
	var r = d * (Math.PI / 180);
	var px = Math.cos(r) * (x-ox) - Math.sin(r) * (y-oy) + ox;
	var py = Math.sin(r) * (x-ox) + Math.cos(r) * (y-oy) + oy;
	return [px, py];
}

function OnWindowResize() {
    window.scrollTo(0, 1);

    d3.select("#mainCanvas")
	    .attr("width", window.innerWidth)
	    .attr("height", window.innerHeight);

	d3.select("#mainSVG")
	    .attr("width", window.innerWidth)
	    .attr("height", window.innerHeight);

	w = window.innerWidth;
	h = window.innerHeight;
	w2 = 0.5 * w;
    h2 = 0.5 * h;
}