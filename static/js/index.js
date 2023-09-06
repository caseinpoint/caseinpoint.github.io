let bgrHue = 176; // background hue: 0-360
let fgrHue = (bgrHue + 180) % 360; // foreground hue: 0-360
let bgrSat = 83; // background saturation: 0-100
let fgrSat = 100 - bgrSat; // foreground saturation: 0-100
let bgrBright = 63; // background brightness: 0-100
let fgrBright = 100 - bgrBright; // foreground brightness: 0-100


function radToDeg(rad) {
	return rad / (Math.PI / 180);
}


function degToRad(deg) {
	return deg * (Math.PI / 180);
}


function getAngle(deltaX, deltaY) {
	if (deltaX === 0) {
		if (deltaY > 0) return 90;
		else if (deltaY < 0) return 270;
		else return 0;
	}

	const rad = Math.atan(deltaY / deltaX);
	const deg = radToDeg(rad);

	if (deltaX > 0) {
		if (deltaY >= 0) return deg;
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


function brightToLight(satStart, brightness) {
	const lightness = brightness * (1 - satStart / 2);

	let saturation = 0;
	if (lightness !== 0 && lightness !== 1) {
		const m = lightness < 1 - lightness ? lightness : 1 - lightness;
		saturation = (brightness - lightness) / m;
	}

	return { saturation, lightness };
}


function setFontColor() {
	const s = fgrSat / 100;
	const b = fgrBright / 100;
	const { saturation, lightness } = brightToLight(s, b);
	const txtSat = Math.round(saturation * 100);
	const txtLight = Math.round(lightness * 100);

	for (let el of document.querySelectorAll('.container-fluid *')) {
		el.style.color = `hsl(${fgrHue}, ${txtSat}%, ${txtLight}%)`;
	}
}


function setHSB() {
	const centerX = Math.trunc(width / 2);
	const centerY = Math.trunc(height / 2);
	const medAxis = Math.trunc((centerX + centerY) / 2);
	const x = mouseX - centerX;
	const y = centerY - mouseY;

	const angle = getAngle(x, y);
	bgrHue = Math.round(angle);
	fgrHue = (bgrHue + 180) % 360;

	const hypotenuse = getHypotenuse(x, y);
	const hypPercent = Math.trunc(hypotenuse / medAxis * 100);
	bgrSat = constrain(hypPercent, 50, 100);
	fgrSat = 100 - bgrSat;
	bgrBright = constrain(hypPercent, 30, 80);
	fgrBright = 100 - bgrBright;
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	background(bgrHue, bgrSat, bgrBright);
	setFontColor();
	noLoop();
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}


function draw() {
	background(bgrHue, bgrSat, bgrBright);
}


function mouseMoved() {
	setHSB();

	setFontColor();

	redraw();
}
