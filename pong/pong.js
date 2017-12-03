"use strict";

var ballColor = "#FFFFFF";

var keyPressed = [];
window.onkeyup = function(e) {keyPressed[e.keyCode]=false;}
window.onkeydown = function(e) {keyPressed[e.keyCode]=true;}

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
	pong.players = [];
	for (var i = 0; i < players; i++) {
		// Oh god it's awful.  Using good ol' high school math, we're putting the paddle in the middle of it's side and giving it the correct angle
		pong.players.push(new Paddle((points[i][0] + points[(i + 1) % players][0])/2, (points[i][1] + points[(i + 1) % players][1])/2, Math.atan((points[i][1] - points[(i + 1) % players][1]) / (points[i][0] - points[(i + 1) % players][0])), color));
	}
	pong.player = pong.players[player];
	pong.player.draw(pong.context);
	pong.ball = new Ball(pong.width/2, pong.height/2, 0, 2);
}

Pong.prototype.update = function() {
	if (keyPressed[37]) { // Left arrow key
		var tx = this.points[0][0] - this.player.x,
				ty = this.points[0][1] - this.player.y,
				dist = Math.sqrt(tx*tx+ty*ty),
				rad = Math.atan2(ty,tx),
				angle = rad/Math.PI * 180;;

		velX = (tx/dist)*2;
		velY = (ty/dist)*2;

		// stop the box if its too close so it doesn't just rotate and bounce
		if(dist > 1){
			this.player.x += velX;
			this.player.y += velY;
		}
	} else if (keyPressed[39]) { // Right arrow key
		var tx = this.points[1][0] - this.player.x,
				ty = this.points[1][1] - this.player.y,
				dist = Math.sqrt(tx*tx+ty*ty),
				rad = Math.atan2(ty,tx),
				angle = rad/Math.PI * 180;;

		var velX = (tx/dist)*2;
		var velY = (ty/dist)*2;

		// stop the box if its too close so it doesn't just rotate and bounce
		if(dist > 1){
			this.player.x += velX;
			this.player.y += velY;
		}
	}
}

Pong.prototype.draw = function() {
	this.context.clearRect(0, 0, this.width, this.height);
	for (var i = 0; i < this.players.length; i++) {
		this.players[i].draw(this.context);
	}
	this.ball.draw(this.context);
}

function PongLoop() {
	pong.update();
	pong.draw();
	// Game updates at up to 60 FPS
	setTimeout(PongLoop, 16.6667);
}

createGame(3, 0, "blue");

PongLoop();