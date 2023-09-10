const axes = {};

const hsv = {};
// initial hsv values
hsv.bgr_hue = 176; // background hue: 0-360
hsv.fgr_hue = (hsv.bgr_hue + 180) % 360; // foreground hue: 0-360
hsv.bgr_sat = 83; // background saturation: 0-100
hsv.fgr_sat = 100 - hsv.bgr_sat; // foreground saturation: 0-100
hsv.bgr_val = 69; // background brightness: 0-100
hsv.fgr_val = 100 - hsv.bgr_val; // foreground brightness: 0-100

let txtFont;


function setAxes() {
	axes.centerX = Math.trunc(width / 2);
	axes.centerY = Math.trunc(height / 2);
	axes.minAxis = axes.centerX <= axes.centerY ? axes.centerX : axes.centerY;
}


function radToDeg(rad) {
	return rad / (Math.PI / 180);
}


function degToRad(deg) {
	return deg * (Math.PI / 180);
}


function getAngle(adjacent, opposite) {
	if (adjacent === 0) {
		if (opposite > 0) return 90;
		else if (opposite < 0) return 270;
		else return 0;
	}

	const rad = Math.atan(opposite / adjacent);
	const deg = radToDeg(rad);

	if (adjacent > 0) {
		if (opposite >= 0) return deg;
		else return 360 + deg;
	} else {
		return 180 + deg;
	}
}
// for (let x = 1; x >= -1; x--) {
// 	for (let y = 1; y >= -1; y--) {
// 		console.log(`x: ${x}, y: ${y}, deg: ${getAngle(x,y)}`);
// 	}
// }


function getHypotenuse(x, y) {
	return Math.sqrt(x ** 2 + y ** 2);
}


function valueToLightness(satStart, value) {
	const lightness = value * (1 - satStart / 2);

	let saturation = 0;
	if (lightness !== 0 && lightness !== 1) {
		const m = lightness < 1 - lightness ? lightness : 1 - lightness;
		saturation = (value - lightness) / m;
	}

	return { saturation, lightness };
}

function setFontColor() {
	const s = hsv.fgr_sat / 100;
	const v = hsv.fgr_val / 100;
	const { saturation, lightness } = valueToLightness(s, v);
	const txtSat = Math.round(saturation * 100);
	const txtLight = Math.round(lightness * 100);

	for (let el of document.querySelectorAll('.txt_change')) {
		el.style.color = `hsl(${hsv.fgr_hue}, ${txtSat}%, ${txtLight}%)`;
	}
}


function writeColorText() {
	// for (let [id, num] of Object.entries(hsv)) {
	// 	document.getElementById(id).textContent = num;
	// }

	const bgrTxt = `Background color: HSV(${hsv.bgr_hue}°, ${hsv.bgr_sat}%, ${hsv.bgr_val}%)`;
	const fgrTxt = `Foreground color: HSV(${hsv.fgr_hue}°, ${hsv.fgr_sat}%, ${hsv.fgr_val}%)`;
	const txt = bgrTxt + '\n' + fgrTxt;

	textFont('Noto Sans Mono');
	textAlign(RIGHT, TOP);
	textSize(13);
	fill(hsv.fgr_hue, hsv.fgr_sat, hsv.fgr_val);
	text(txt, width - 10, height * 0.05);
}


function setHSV() {
	const x = mouseX - axes.centerX;
	const y = axes.centerY - mouseY;

	const angle = getAngle(x, y);
	hsv.bgr_hue = Math.round(angle);
	hsv.fgr_hue = (hsv.bgr_hue + 180) % 360;

	const hypotenuse = getHypotenuse(x, y);
	const hypPercent = constrain(Math.trunc(hypotenuse / axes.minAxis * 100), 0, 100);

	hsv.bgr_sat = Math.round(map(hypPercent, 0, 100, 40, 100));
	// hsv.fgr_sat = 100 - hypPercent;
	hsv.fgr_sat = Math.round(map(100 - hypPercent, 0, 100, 40, 100));

	hsv.bgr_val = Math.round(map(hypPercent, 0, 100, 40, 80));
	// hsv.fgr_val = 100 - hypPercent;
	hsv.fgr_val = Math.round(map(100 - hypPercent, 0, 100, 40, 80));
}


function drawColorCircle() {
	const vLen = Math.round(axes.minAxis * 0.97);

	push();
	translate(axes.centerX, axes.centerY);
	strokeWeight(8);
	noFill();

	for (let deg = 0; deg < 360; deg++) {
		// negative = counter-clockwise to match colors
		const radStart = degToRad(deg) * -1;
		const radEnd = degToRad(deg + 1) * -1;

		const vectStart = p5.Vector.fromAngle(radStart, vLen);
		const vectEnd = p5.Vector.fromAngle(radEnd, vLen);

		stroke(deg, 100, 80);

		beginShape();
		vertex(vectStart.x, vectStart.y);
		vertex(vectEnd.x, vectEnd.y);
		endShape();
	}

	pop();
}


function drawColorWave() {
	const scale = 0.02;
	const colorStart = color(hsv.fgr_hue, hsv.fgr_sat, hsv.fgr_val, 0.9);
	const colorEnd = color(hsv.bgr_hue, hsv.bgr_sat, hsv.bgr_val, 0.8);

	for (let x = 0; x < width; x++) {
		const noiseVal = noise((frameCount - x) * scale, (mouseY - x) * scale);
		const yNoise = height * 0.05 * noiseVal;
		const colorNoise = lerpColor(colorStart, colorEnd, noiseVal);
		stroke(colorNoise);
		line(x, 0, x, yNoise);

		const yCos = height * 0.025 - Math.cos((frameCount - x) * scale) * 10;
		const colorCos = lerpColor(colorStart, colorEnd, x / width);
		stroke(colorCos);
		line(x, height, x, height - yCos);
	}
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	setAxes();

	colorMode(HSB);

	// noLoop();
}


function draw() {
	background(hsv.bgr_hue, hsv.bgr_sat, hsv.bgr_val);
	setFontColor();
	writeColorText();

	drawColorCircle();
	drawColorWave();
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	setAxes();

	// if noLoop in setup, call redraw
	// redraw();
}


function mouseMoved() {
	setHSV();

	// if noLoop in setup, call redraw
	// redraw();
}
