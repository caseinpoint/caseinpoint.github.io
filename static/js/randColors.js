"use strict";

/* Handle random colors */

let RANDO = false;
let FIRST_CLICK = true;
let TIMEOUT_ID;

// function randomHSLA() {
// 	const h = Math.floor(Math.random() * 360);
// 	const s = Math.floor(Math.random() * 51 + 50);
// 	const l = Math.floor(Math.random() * 101);
// 	let a = Math.random() * 0.222 + 0.111;
// 	a = a.toFixed(2);

// 	return `hsla(${h},${s}%,${l}%,${a})`;
// }

function randomRGBA(aMin=0.15, aMax=0.3) {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	let a = Math.random() * (aMax - aMin) + aMin;
	a = a.toFixed(2);

	return `rgba(${r},${g},${b},${a})`;
}

const colorBtn = document.getElementById("rand_colors");
colorBtn.addEventListener("click", () => {
	colorBtn.classList.toggle("btn-outline-primary");
	colorBtn.classList.toggle("btn-primary");

	if (RANDO) {
		RANDO = false;
		FIRST_CLICK = true;

		colorBtn.textContent = "Random Colors On";

		clearTimeout(TIMEOUT_ID);

		for (let div of document.querySelectorAll("div")) {
			div.style.backgroundColor = "unset";
		}
	} else {
		RANDO = true;

		colorBtn.textContent = "Random Colors Off";

		(function recursiveDelay() {
			let delay;
			if (FIRST_CLICK) {
				// always start with delay of 1 second
				FIRST_CLICK = false;
				delay = 1000;
			} else {
				// random delay between 2 and 12 seconds (2d6)
				delay = 2000 + Math.floor(Math.random() * 10001);
			}

			TIMEOUT_ID = setTimeout(() => {
				for (let div of document.querySelectorAll("div")) {
					// ~1 in 6 (1d6) chance of changing color for each div
					if (Math.random() <= 0.16667) {
						// div.style.backgroundColor = randomHSLA();
						div.style.backgroundColor = randomRGBA();
					} else {
						div.style.backgroundColor = "unset";
					}
				}

				recursiveDelay();
			}, delay);
		})();
	}
});


/* Handle dark/light mode */

const darkModeBtn = document.getElementById("dark_mode");

darkModeBtn.addEventListener("click", () => {
	darkModeBtn.classList.toggle('btn-outline-light');
	darkModeBtn.classList.toggle('btn-outline-dark');

	const body = document.querySelector("body");
	if (body.dataset.bsTheme === "dark") {
		body.dataset.bsTheme = "light";
		darkModeBtn.textContent = "Dark Mode On";
	} else {
		body.dataset.bsTheme = "dark";
		darkModeBtn.textContent = "Dark Mode Off";
	}
});
