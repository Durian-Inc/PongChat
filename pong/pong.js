"use strict";

var ballColor = "#FFFFFF";

// Objects for our pong game

// Game object, stores the game state
function Pong() {
	var canvas = document.getElementById("pong");
	// Game is played in a 1:1 aspect ratio
	this.width = this.height = canvas.width = canvas.height;
	this.context = canvas.getContext("2d");
}

// Ball gets bounced off paddles and speeds up
// x and y are coordinates, dir is the direction its moving (radians), speed is its speed (pixels/second)
function Ball(x, y, dir, speed) {
	this.x = x;
	this.y = y;
	this.dir = dir;
	this.speed = speed;
};

// Each player has and controls a paddle
// x and y are coordinates, a is the angle of the paddle (radians), and color is its color
function Paddle(x, y, angle, color) {
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.color = color;
}

var pong = new Pong();

// Drawing objects
Ball.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.fillStyle = ballColor;
	ctx.arc(this.x, this.y, ctx.canvas.height*0.005, 0, 2*Math.PI);
	ctx.fill();
}

Paddle.prototype.draw = function(ctx) {
	var width = ctx.canvas.height * 0.05;
	var height = width/5;
	ctx.fillStyle = this.color;
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);
	ctx.fillRect(-width/2, -height/2, width, height);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// players is number of players, player indicates which player this client is (between 0 and number of players - 1)
function createGame(players, player, color) {
	var points = generatePoints(pong.width/2, pong.height/2, players, pong.width/2, 0);
	drawRegularPolygon(pong.context, pong.width/2, pong.height/2, players, pong.width/2, 0, false, null, true, "red", 5);
	pong.points = [points[player], points[(player + 1) % players]];
	// Oh god it's awful.  Using good ol' high school math, we're putting the paddle in the middle of it's side and giving it the correct angle
	pong.player = new Paddle((pong.points[0][0] + pong.points[1][0])/2, (pong.points[0][1] + pong.points[1][1])/2, Math.atan((pong.points[0][1] - pong.points[1][1]) / (pong.points[0][0] - pong.points[1][0])), color);
	pong.player.draw(pong.context);
	
}

function PongLoop() {
	pong.update();
	pong.draw();
	// Game updates at up to 60 FPS
	setTimeout(PongLoop, 16.6667);
}

createGame(7, 6, "blue");