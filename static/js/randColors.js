"use strict";

let RANDO = false;
let FIRST_CLICK = true;
let INTERVAL_ID;

// function randomHSLA() {
// 	const h = Math.floor(Math.random() * 360);
// 	const s = Math.floor(Math.random() * 51 + 50);
// 	const l = Math.floor(Math.random() * 101);
// 	let a = Math.random() * 0.222 + 0.111;
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
		FIRST_CLICK = true;

		colorBtn.textContent = "Random Colors On";

		clearInterval(INTERVAL_ID);

		for (let div of document.querySelectorAll("div")) {
			div.style.backgroundColor = "unset";
		}
	} else {
		RANDO = true;

		colorBtn.textContent = "Random Colors Off";

		(function loop() {
			let delay;
			if (FIRST_CLICK) {
				// always start with delay of 1 second
				FIRST_CLICK = false;
				delay = 1000;
			} else {
				// random delay between 2 and 20 seconds
				delay = 2000 + Math.floor(Math.random() * 18001);
			}

			INTERVAL_ID = setTimeout(() => {
				for (let div of document.querySelectorAll("div")) {
					// ~1 in 6 chance of changing color for each div
					if (Math.random() <= 0.16667) {
						// div.style.backgroundColor = randomHSLA();
						div.style.backgroundColor = randomRGBA();
					} else {
						div.style.backgroundColor = "unset";
					}
				}

				loop();
			}, delay);
		})();
	}
});
