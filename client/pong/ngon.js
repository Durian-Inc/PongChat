/*
ngon.js (Version 0.9) by Tom Steinbrecher
Website: Tom Steinbrecher.me | Twitter: @TomSteinbrecher | Email: Tom@TomSteinbrecher.me

ngon.js is subject to:

The MIT License (MIT)

Copyright (c) 2013 Thomas Steinbrecher

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

/* DOCUMENTATION

Quick Reference Guide:
Context:
	Context is where you must pass your canvas context object. This allows the function to draw to the canvas
x & y:
	x is the x value of the center of the polygon
	y is the y value of the center of the polygon
radius:
	radius is the radius of the polygon as measured from center point to each vertice
offset:
	this is the rotational offset of the polygon from it's normal orientation
Setting the offset:
	For squares:
		Use Math.PI / 4 | This will set the lines horizontal and vertical
	For all other polygons:
		Use Math.PI     | This will set the peak vertex at the top, or horizontal at the top
fill:
	set true/false depending on whether the polygon should be rendered with a fill
fillColor:
	color of the fill
stroke:
	set true/false depending on whether the polygon should be rendered with a stroke
strokeColor:
	color of the stroke
strokeWidth:
	set the width (in pixels) of the stroke
*/

function drawRegularPolygon(context, x, y, sides, radius, offset, fill, fillColor, stroke, strokeColor, strokeWidth){
	var vertices = generatePoints(x,y,sides,radius,offset);
	context.beginPath(vertices[0][0], vertices[0][1]);
	for (var i = 0; i < vertices.length; i++){
			context.lineTo(vertices[i][0],vertices[i][1]);
	}
	context.lineTo(vertices[0][0], vertices[0][1]);
	context.ClosePath
	if(fill == true)
	{
			context.fillStyle = fillColor;
			context.fill();
	}
	if (stroke == true)
	{
			context.strokeStyle = strokeColor;
			context.lineWidth = strokeWidth;
			context.stroke();
	}
}

function drawRegularPolygonSplit(context, x, y, sides, radius, offset, fill, fillColors, stroke, strokeColors, strokeWidth){    
	var vertices = generatePoints(x,y,sides,radius,offset);
	
	for (var i = 0; i < vertices.length; i++){
			context.beginPath(x,y);
			context.lineTo(vertices[i][0],vertices[i][1]);
			context.lineTo(vertices[(i + 1) % vertices.length][0],vertices[(i + 1) % vertices.length][1]);
			context.lineTo(x,y);
			context.ClosePath
			if(fill == true)
			{
					context.fillStyle = fillColors[i];        
					context.fill();
			}
			if(stroke == true)
			{
					context.strokeStyle = strokeColors[i];        
					context.lineWidth = strokeWidth;
					context.stroke();
			}
	}
}

function generatePoints (x, y, sides, radius, offset){      
	var angle = 2 * Math.PI / sides;    
	var points = [];
	for (var i = 0; i < sides; i++)
	{
			var single = [];
			var verticeX = x + radius * Math.sin((i * angle) + offset);  //Magical math! Okay, not really, if you're not sure what's going on here, 
			var verticeY = y + radius * Math.cos((i * angle) + offset);  //it is a transformation matrix. The docs explain the math if you're interested
			single.push(verticeX);
			single.push(verticeY);
			points.push(single);
	}    
	return points;
}

