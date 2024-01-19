'use strict';

let RAND = false;
let intervalID;

function randomHSLA() {
	const h = Math.floor(Math.random() * 360);
	const s = Math.floor(Math.random() * 51 + 50);
	const l = Math.floor(Math.random() * 101);
	const a = Math.random() * 0.222 + 0.111;

	return `hsla(${h},${s}%,${l}%,${a})`;
}

const colorBtn = document.getElementById('rand_colors');
colorBtn.addEventListener('click', () => {
	colorBtn.classList.toggle('btn-outline-primary');
	colorBtn.classList.toggle('btn-primary');

	if (RAND) {
		RAND = false;

		colorBtn.textContent = 'Random Colors On';

		clearInterval(intervalID);

		for (let div of document.querySelectorAll('div')) {
			div.style.backgroundColor = 'unset';
		}
	} else {
		RAND = true;

		colorBtn.textContent = 'Random Colors Off';

		intervalID = setInterval(() => {
			for (let div of document.querySelectorAll('div')) {
				if (Math.random() >= 0.666) {
					div.style.backgroundColor = randomHSLA();
				} else {
					div.style.backgroundColor = 'unset';
				}
			}
		}, Math.PI * 1000);
	}
});
