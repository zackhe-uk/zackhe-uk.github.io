// also check out https://openprocessing.org/user/329506 :)

// config
// --> dev
let thumb = false;
// --> score
let scoreScale = 10;
let scoreGap   = 0; // defined in setup
let scoreGapY  = 100;
let font = [
	[
		[1,1,1,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,1,1,1]
	], [
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1]
	], [
		[1,1,1,1],
		[0,0,0,1],
		[0,0,0,1],
		[1,1,1,1],
		[1,0,0,0],
		[1,0,0,0],
		[1,0,0,0],
		[1,1,1,1]
	], [
		[1,1,1,1],
		[0,0,0,1],
		[0,0,0,1],
		[1,1,1,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[1,1,1,1]
	], [
		[1,0,0,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,1,1,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1]
	], [
		[1,1,1,1],
		[1,0,0,0],
		[1,0,0,0],
		[1,1,1,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[1,1,1,1]
	], [
		[1,0,0,0],
		[1,0,0,0],
		[1,0,0,0],
		[1,1,1,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,1,1,1]
	], [
		[1,1,1,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1]
	], [
		[1,1,1,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,1,1,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,1,1,1]
	], [
		[1,1,1,1],
		[1,0,0,1],
		[1,0,0,1],
		[1,1,1,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1]
	]
]
// --> midline
let lineHeight   = 15;
let lineGap      = 15;
let lineStroke   = 4;
// --> paddle
let paddleHeight = 60;
let paddleDist   = 40;
let paddleGap    = 20;
let paddleSpeed  = 10;
let paddleStroke = 10;
// --> ball
let ballSize     = paddleStroke;
let ballGap      = 0; // set to height/3 in setup
let ballMaxYS    = 4;
let ballMaxXS    = 8;
// --> HTML extras
let gameReady = false;
// variables
let ball       = {
	"x": 0,
	"y": 0,
	"xs": 0,
	"ys": 0,
	"sm": 1,
	"exists": true
};
let paddles    = [ {
	"x": 0,
	"y": 0,
	"s": 0,
	"active": 0,
	"l": true // left?
}, {
	"x": 0,
	"y": 0,
	"s": 0,
	"active": 0,
	"l": false
}, ];

function setup() {
	createCanvas(thumb ? windowHeight : (windowHeight/3*4), windowHeight);
	background(100);
	// most of the below is directly copied and pasted from the MDN web docs page for OscillatorNode
}
function realsetup() {
	// create web audio api context
	window.audioCtx = new AudioContext();

	// create Oscillator node
	window.oscillator = audioCtx.createOscillator();

	oscillator.type = "square";
	oscillator.frequency.value = 200; // value in hertz
	oscillator.connect(audioCtx.destination);
	
	
	window.gain = new GainNode(audioCtx);
	const analyser = new AnalyserNode(audioCtx, {
		fftSize: 1024,
		smoothingTimeConstant: 0.8,
	});
	oscillator.connect(gain).connect(analyser).connect(audioCtx.destination);
	oscillator.start(audioCtx.currentTime);
	gain.gain.linearRampToValueAtTime(-1, audioCtx.currentTime);
	
	ballGap = height/3;
	scoreGap = width/5;
	
	paddles[0].x =         paddleDist;
	paddles[1].x = width - paddleDist;
	paddles[0].y = (height/2) - paddleHeight;
	paddles[1].y = (height/2) - paddleHeight;
	
	reconfigBall();

	gameReady = true;
}

function blip(osctype, oscfreq, time) {
	oscillator.type = osctype;
	oscillator.frequency.value = oscfreq;
	gain.gain.linearRampToValueAtTime(-0.9, audioCtx.currentTime);
	setTimeout(() => {
		gain.gain.linearRampToValueAtTime(-1, audioCtx.currentTime);
	}, time);
}
function reconfigBall() {
	ball.exists  = true;
	ball.x       = width/2;
	ball.y 			 = (Math.random() < 0.5) ? ballGap : height - ballGap; // ??? emulating weird pong quirk?
	ball.xs      = ballMaxXS;
	ball.ys      = (ball.y == ballGap) ? ballMaxYS : -ballMaxYS;
	ball.sm      = 1;
}
function pongBlip(bliptype) {
	// https://stelioskanitsakis.medium.com/an-audio-comparison-between-the-sounds-of-ataris-pong-and-the-silence-of-magnavox-odyssey-s-83e6fac56653
	switch(bliptype) {
		case 0:
			// wall
			blip("square", 226, 16);
			break
		case 1:
			// paddle
			blip("square", 459, 96);
			break
		case 2:
			// point
			blip("square", 490, 257);
			break
	}
}
addEventListener("click", (e) => {
	if(!gameReady) realsetup();
});
addEventListener("keydown", (e) => {
	if(!gameReady) return;
	if(e.key == 'ArrowUp') {
		paddles[1].active = -1;
	}
	if(e.key == 'ArrowDown') {
		paddles[1].active =  1;
	}
	if(e.key.toLowerCase() == 'w') {
		paddles[0].active = -1;
	}
	if(e.key.toLowerCase() == 's') {
		paddles[0].active =  1;
	}
});

addEventListener("keyup", (e) => {
	if(!gameReady) return;
	if(e.key == 'ArrowUp') {
		paddles[1].active =  0;
	}
	if(e.key == 'ArrowDown') {
		paddles[1].active =  0;
	}
	if(e.key.toLowerCase() == 'w') {
		paddles[0].active =  0;
	}
	if(e.key.toLowerCase() == 's') {
		paddles[0].active =  0;
	}
})

function logic() {
	ball.x += ball.xs * ball.sm;
	ball.y += ball.ys * ball.sm;
	for(let paddle of paddles) {
		if(paddle.active != 0) {
			paddle.y += paddleSpeed * paddle.active;
		}
		let x = paddle.x - (paddleStroke/2);
		let y = paddle.y - (paddleHeight/2);
		let w = paddleStroke;
		let h = paddleHeight;
		let x2 = ball.x - (ballSize / 2);
		let y2 = ball.y - (ballSize / 2);
		let w2 = ballSize;
		let h2 = ballSize;
		
		if(
			(
					x + w >= x2 &&    // r1 right edge past r2 left
					x <= x2 + w2 &&    // r1 left edge past r2 right
					y + h >= y2 &&    // r1 top edge past r2 bottom
					y <= y2 + h2
				
			) && ball.exists
		)
		{
			pongBlip(1);
			ball.sm  += 0.1;
			ball.xs  *= -1;
			ball.ys   = (Math.random() - 0.5)*5;
			ball.x    = paddle.l ? Math.max(ball.x, paddle.x + (paddleStroke/2)) : Math.min(ball.x, paddle.x - (paddleStroke/2));
		}
	}
	if(!ball.exists)
		return;
	if(ball.y - (ballSize / 2) < 0 || ball.y + (ballSize / 2) > height) {
		ball.ys    *= -1;
		ball.y      = Math.max((ballSize / 2), Math.min(height - (ballSize / 2), ball.y));
		pongBlip(0);
	}
	if(ball.x - (ballSize / 2) < 0 || ball.x + (ballSize / 2) > width) {
		if(ball.x + (ballSize / 2) > width)
			paddles[0].s++
		else
			paddles[1].s++
		
		ball.xs     = 0;
		ball.x      = Math.max((ballSize / 2), Math.min(width  - (ballSize / 2), ball.x));
		
		pongBlip(2);
		ball.exists = false;
		setTimeout(reconfigBall, 1000);
	}
}

function draw() {
	if(!gameReady) return;
	logic();
	
	background(0);
	stroke(255);
	strokeWeight(lineStroke);
	strokeCap(SQUARE);
	noFill();
	for(let i = 0; i < height / (lineHeight + lineGap); i++) {
		line(width/2, i * (lineHeight + lineGap),
				 width/2, i * (lineHeight + lineGap) + lineHeight
		);
	}
	
	noStroke();
	fill(255);
	for(let paddle of paddles) {
		// solidify position to not go outside weird paddle bound
		paddle.y = Math.min(height - (paddleGap + paddleHeight), Math.max(paddleGap + paddleHeight, paddle.y));
		rect(paddle.x - (paddleStroke/2), paddle.y - (paddleHeight/2), paddleStroke, paddleHeight);
		let pFNIO = paddle.s.toString().split("").map(a => parseInt(a)); //paddleFontNumsInOrder
		
		for(let pnum = 0; pnum < pFNIO.length; pnum++) {
			for(let i = 0; i < 8; i++) {
				for(let j = 0; j < 4; j++) {
					if(font[pFNIO[pnum] % font.length][i][j] == 1) {
						rect(Math.floor(paddle.l ? (width / 2 - scoreGap) : (width / 2 + scoreGap)) + ((j + (pnum * 5)) * scoreScale), scoreGapY + (i * scoreScale), scoreScale, scoreScale);
					}
				}
			}
		}
	}
	if(ball.exists) {
		noStroke();
		fill(200);
		square(
			ball.x - (ballSize / 2),
			ball.y - (ballSize / 2),
			ballSize
		);
	}
}
/*function mousePressed() {
	pongBlip(Math.floor(Math.random()*3));
}*/
