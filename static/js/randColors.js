"use strict";

let RANDO = false;
let intervalID;

// function randomHSLA() {
// 	const h = Math.floor(Math.random() * 360);
// 	const s = Math.floor(Math.random() * 51 + 50);
// 	const l = Math.floor(Math.random() * 101);
// 	const a = Math.random() * 0.222 + 0.111;
// 	a = a.toFixed(2);

// 	return `hsla(${h},${s}%,${l}%,${a})`;
// }

function randomRGBA() {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	let a = 0.15 + Math.random() * 0.15;
	a = a.toFixed(2);

	return `rgba(${r},${g},${b},${a})`;
}

const colorBtn = document.getElementById("rand_colors");
colorBtn.addEventListener("click", () => {
	colorBtn.classList.toggle("btn-outline-primary");
	colorBtn.classList.toggle("btn-primary");

	if (RANDO) {
		RANDO = false;

		colorBtn.textContent = "Random Colors On";

		clearInterval(intervalID);

		for (let div of document.querySelectorAll("div")) {
			div.style.backgroundColor = "unset";
		}
	} else {
		RANDO = true;

		colorBtn.textContent = "Random Colors Off";

		intervalID = setInterval(() => {
			for (let div of document.querySelectorAll("div")) {
				if (Math.random() >= 0.75) {
					// div.style.backgroundColor = randomHSLA();
					div.style.backgroundColor = randomRGBA();
				} else {
					div.style.backgroundColor = "unset";
				}
			}
		}, Math.PI * 2000);
	}
});
