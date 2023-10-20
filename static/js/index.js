const axes = {};
let mouseFrames = 0;
let bgOn = true;
let bgBtn;

const hsv = {};
// initial hsv values
hsv.bgr_hue = 176; // background hue: 0-360
hsv.fgr_hue = mod(hsv.bgr_hue + 180, 360); // foreground hue: 0-360
hsv.bgr_sat = 83; // background saturation: 0-100
hsv.fgr_sat = 100 - hsv.bgr_sat; // foreground saturation: 0-100
hsv.bgr_val = 69; // background brightness: 0-100
hsv.fgr_val = 100 - hsv.bgr_val; // foreground brightness: 0-100


function mod(n, d) {
	return ((n % d) + d) % d;
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
	/* Convert HSV to HSL */

	const lightness = value * (1 - satStart / 2);

	let saturation = 0;
	if (lightness !== 0 && lightness !== 1) {
		const m = lightness < 1 - lightness ? lightness : 1 - lightness;
		saturation = (value - lightness) / m;
	}

	return { saturation, lightness };
}

function setFontColor() {
	/* Set the HSL color of text elements on the page */

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
	/* Write the current color information on the page */

	const len = 'Background color: HSV(360°, 100%, 90%)'.length;

	let bgrTxt = `Background color: HSV(${hsv.bgr_hue}°, ${hsv.bgr_sat}%, ${hsv.bgr_val}%)`;
	while (bgrTxt.length < len) bgrTxt += ' ';

	let fgrTxt = `Foreground color: HSV(${hsv.fgr_hue}°, ${hsv.fgr_sat}%, ${hsv.fgr_val}%)`;
	while (fgrTxt.length < len) fgrTxt += ' ';

	const txt = bgrTxt + '\n' + fgrTxt;

	textFont('Noto Sans Mono');
	textAlign(RIGHT, TOP);
	textSize(13);
	fill(hsv.fgr_hue, hsv.fgr_sat, hsv.fgr_val);
	text(txt, width - 10, 10);
}


function setHSV() {
	/* Set HSV based on polar and temporal coordinates of the mouse */

	const x = mouseX - axes.centerX;
	const y = axes.centerY - mouseY;

	const angle = getAngle(x, y);
	hsv.bgr_hue = Math.round(angle);
	hsv.fgr_hue = mod(hsv.bgr_hue + 180, 360);

	const hypotenuse = getHypotenuse(x, y) | 0;

	const modFrames = mod(mouseFrames, 360);
	const sinFrames = Math.sin(degToRad(modFrames));
	hsv.bgr_sat = Math.round(map(sinFrames, -1, 1, 40, 100));
	hsv.fgr_sat = Math.round(map(sinFrames * -1, -1, 1, 40, 100));

	const hypPercent = constrain(hypotenuse / axes.minAxis * 100, 0, 100);
	hsv.bgr_val = Math.round(map(hypPercent, 0, 100, 30, 90));
	hsv.fgr_val = Math.round(map(100 - hypPercent, 0, 100, 30, 90));
}


function drawColorCircle() {
	/* Draw a colorful circle */

	const vLen = Math.round(axes.minAxis * 0.97);

	push();
	translate(axes.centerX, axes.centerY);

	fill(hsv.fgr_hue, hsv.fgr_sat, hsv.fgr_val);
	noStroke();
	// negative angle = match movement of mouse
	const radHSV = degToRad(hsv.bgr_hue) * -1;
	const vectHSV = p5.Vector.fromAngle(radHSV, vLen + 8);
	circle(vectHSV.x, vectHSV.y, 8);

	noFill();
	strokeWeight(8);

	for (let deg = 0; deg < 360; deg++) {
		// negative angle = counter-clockwise to match colors
		const radStart = degToRad(deg) * -1;
		const radEnd = degToRad(deg + 1) * -1;

		const vectStart = p5.Vector.fromAngle(radStart, vLen);
		const vectEnd = p5.Vector.fromAngle(radEnd, vLen);

		stroke(deg, 100, 90);

		beginShape();
		vertex(vectStart.x, vectStart.y);
		vertex(vectEnd.x, vectEnd.y);
		endShape();
	}

	pop();
}


function drawColorWave() {
	/* Draw a pseudo-random wave using Perlin noise and linear interpolation of colors

	Based on p5.js examples:
	https://p5js.org/reference/#/p5/noise
	https://p5js.org/reference/#/p5/lerpColor */

	const noiseScale = 0.015625;

	const colorStart = color(hsv.bgr_hue, hsv.bgr_sat, hsv.bgr_val);
	const colorEnd = color(hsv.fgr_hue, hsv.fgr_sat, hsv.fgr_val);

	for (let x = 0; x < width; x++) {
		const noiseVal = noise((frameCount - x) * noiseScale, (mouseY - x) * noiseScale);
		const yNoise = height * 0.05 * noiseVal;
		const colorNoise = lerpColor(colorStart, colorEnd, noiseVal);
		stroke(colorNoise);
		line(x, height, x, height - yNoise);
	}
}


function resizeImgs() {
	/* Scale <img> elements to fit exactly within the color circle, preserve aspect ratios */

	for (let img of document.getElementsByTagName('img')) {
		const cDiam = axes.minAxis * 0.96 * 2;
		const scale = Math.sqrt(cDiam ** 2 / (img.width ** 2 + img.height ** 2));
		img.width *= scale;
		img.height *= scale;
		img.style.height = 'auto';
	}
}


function setAxes() {
	/* Set window coordinates of x- and y-axis origin */
	axes.centerX = width / 2 | 0;
	axes.centerY = height / 2 | 0;
	axes.minAxis = axes.centerX <= axes.centerY ? axes.centerX : axes.centerY;
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	setAxes();
	resizeImgs();

	colorMode(HSB);

	bgBtn = createButton();
	bgBtn.position(width - 240, 45);
	const disable = '<i class="bi bi-display"></i> Disable background color';
	const enable = '<i class="bi bi-display-fill"></i> Enable background color';
	bgBtn.elt.innerHTML = disable;
	bgBtn.mousePressed(() => {
		bgOn = !bgOn;
		bgBtn.elt.innerHTML = bgOn ? disable : enable;
	});
	bgBtn.elt.classList.add('btn', 'btn-outline-primary');
}


function draw() {
	if (bgOn) background(hsv.bgr_hue, hsv.bgr_sat, hsv.bgr_val);
	else background(197, 3, 88);

	drawColorWave();
	drawColorCircle();

	setFontColor();
	writeColorText();
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	setAxes();
	resizeImgs();
}


function mouseMoved() {
	mouseFrames++;
	setHSV();
}
