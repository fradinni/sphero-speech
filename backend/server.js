var sp = require('./sphero.js');

var sphero = new sp.Sphero();
var express = require('express');
var app = express();


var _ball;
var connected = false;


//
// Generate Random Colors
//
var random_color = function(){
  var r = Math.random()*255;
  var g = Math.random()*255;
  var b = Math.random()*255;
  return [r,g,b];
};



////////////////////////////////////////////////////
// SPHERO Events
//

//
// ON CONNECTED
//


/////////////////////////////////////////////////
// API REST


//
// Connect to Sphero
//
app.get('/connect', function(req, res) {

	if(!connected) {
		sphero.connect();
	}

	sphero.on("connected", function(ball){
		console.log("Connected!", ball);
		_ball = ball;
		connected = true;
		res.send(200, {status: "connected"});
	});
});


//
// Close connection to Sphero
//
app.get('/close', function(req, res) {
	console.log('Disconnect !');
	process.exit(0);
});


app.get('/randomColor', function(req, res) {
	var rgb = random_color();
	sphero.setRGBLED(rgb[0], rgb[1], rgb[2], false);

	res.send(200, {status: "ok"});
});


//
// Set Back LED Status
//
app.get('/setBackLed/:status', function(req, res) {
	var status = req.param('status');

	if(status == '0') {
		sphero.setBackLED(0);
	}
	else if(status == '1') {
		sphero.setBackLED(1);
	}

	res.send(200, {status: "unknown"});
});


app.listen(3000);
console.log('Listening on port 3000');