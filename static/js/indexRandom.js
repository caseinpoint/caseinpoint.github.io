const CANVAS = document.getElementById('main_canvas');
const CTX = CANVAS.getContext('2d');

let MIN_HEIGHT;
let MAX_HEIGHT;
let LINES;
const LINE_WIDTH = 5;


function resizeCanvas() {
	// scale canvas and fit to window
	const dpr = window.devicePixelRatio;
	CANVAS.width = window.innerWidth * dpr;
	CANVAS.height = window.innerHeight * dpr;
	CTX.scale(dpr, dpr);
	CANVAS.style.width = `${window.innerWidth}px`;
	CANVAS.style.height = `${window.innerHeight}px`;

	// set values for generating lines
	MIN_HEIGHT = CANVAS.height * 0.0125;
	MAX_HEIGHT = CANVAS.height * 0.075;
}


function randInt(min, max) {
	// return random integer r, where min <= r < max

	const minCeil = Math.ceil(min);
	const maxFloor = Math.floor(max);
	return Math.floor(Math.random() * (maxFloor - minCeil) + minCeil);
}


function getRandColor() {
	// return HSL color string with random values

	const h = randInt(0, 361);
	const s = randInt(0, 101);
	const l = randInt(50, 76);
	const a = randInt(70, 81);

	return `hsl(${h}deg ${s}% ${l}% / ${a}%)`;
}


class Line {
	// class for each vertical line in animation

	constructor(x, height, color) {
		this.height = height;
		this.color = color;
		this.x = x;
		this.y = CANVAS.height - height;
	}

	moveRight(newHeight) {
		this.x = (this.x + LINE_WIDTH) % window.innerWidth;

		this.height = newHeight;
		this.y = window.innerHeight - newHeight;
	}
}


function generateLines() {
	// initialize LINES with random VALUES

	LINES = [];
	let currentHeight = randInt(MIN_HEIGHT, MAX_HEIGHT + 1);

	for (let i = 0; i < window.innerWidth; i += LINE_WIDTH) {
		let newHeight = currentHeight + randInt(-1 * LINE_WIDTH, LINE_WIDTH+1);
		if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
			currentHeight = newHeight;
		}

		const color = getRandColor();

		LINES.push(new Line(i, currentHeight, color));
	}
}

// count animation frames to slow down scrolling
let frame = 0;
const frameMod = 7;

function animate(timestamp) {
	// animate moving and changing lines

	window.requestAnimationFrame(animate);

	// slow down animation by only changing on certain frames
	if (frame % frameMod === 0) {
		// prevent trailing lines
		// CTX.clearRect(0, MAX_HEIGHT, CANVAS.width, CANVAS.height)

		// set background color
		CTX.fillStyle = '#D0E3DE';
		CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
	
		for (let idx = 0; idx < LINES.length; idx++) {
			const l = LINES[idx]

			const prevIdx = idx - 1 >= 0 ? idx - 1 : LINES.length - 1;
			prevL = LINES[prevIdx];

			// draw line connected to previous line at an angle
			CTX.fillStyle = l.color;
			CTX.beginPath();
			CTX.moveTo(l.x, window.innerHeight);
			CTX.lineTo(l.x, prevL.y);
			CTX.lineTo(l.x + LINE_WIDTH, l.y);
			CTX.lineTo(l.x + LINE_WIDTH, window.innerHeight);
			CTX.fill()

			// change heights of random lines by random amounts
			let newHeight = l.height;
			if (frame % randInt(frameMod * 2, frameMod * 3 + 1) == 0) {
				const rHeight = newHeight + randInt(-1 * LINE_WIDTH, LINE_WIDTH + 1);
				if (rHeight >= MIN_HEIGHT && rHeight <= MAX_HEIGHT) {
					newHeight = rHeight;
				}
			}

			l.moveRight(newHeight);
		}
	}

	frame++;
}


(function main() {
	// initialize canvas size
	resizeCanvas();

	// initialize LINES array
	generateLines();

	// resize canvas if window changes and regenerate lines
	window.addEventListener('resize', () => {
		resizeCanvas();
		generateLines();
	});

	// start animation
	animate();
})();
