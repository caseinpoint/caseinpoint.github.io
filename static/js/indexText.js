// access to created elements
const ELEMENTS = {
	divs: [],
	divIdx: 0,
	yScroll: 100,
	elIdx: 0,
	xScroll: 0
};


function initText(data) {
	// initialize text elements from static JSON object array
	const mainElement = document.getElementById('main_content');

	for (i = 0; i < data.length; i++) {
		const d = data[i];

		// create object to track div and sub-elements
		const divObj = {
			div: null,
			els: [],
		};
		ELEMENTS.divs.push(divObj);

		// create elements
		const div = document.createElement('div');
		div.id = `div_${i}`;
		div.classList.add('data_div');
		mainElement.appendChild(div);
		divObj.div = div;

		const h1 = document.createElement('h1');
		h1.innerText = d.h1;
		div.appendChild(h1);
		divObj.els.push(h1);

		const h2 = document.createElement('h2');
		h2.innerText = d.h2;
		div.appendChild(h2);
		divObj.els.push(h2);

		if (d.img != null) {
			const img = document.createElement('img');
			img.src = d.img;
			img.alt = d.h2;
			div.appendChild(img);
			divObj.els.push(img);
		}

		for (let line of d.text.split('\n')) {
			const p = document.createElement('p');
			p.innerText = line;
			div.appendChild(p);
			divObj.els.push(p);
		}

		const tech = document.createElement('p');
		const tIcon = document.createElement('i');
		tIcon.classList.add('bi', 'bi-stack');
		tech.insertAdjacentElement('afterbegin', tIcon);
		tech.insertAdjacentText('beforeend', ` Tech Stack: ${d.tech}`);
		div.appendChild(tech);
		divObj.els.push(tech);

		if (d.link != null) {
			const deployedP = document.createElement('p');
			const deployedA = document.createElement('a');
			deployedA.href = d.link;
			deployedA.target = '_blank';
			const dIcon = document.createElement('i');
			dIcon.classList.add('bi');
			deployedA.insertAdjacentElement('afterbegin', dIcon);
			if (d.link.includes('linkedin')) {
				dIcon.classList.add('bi-linkedin');
				deployedA.insertAdjacentText('beforeend', ` LinkedIn: ${d.link}`);
			} else {
				dIcon.classList.add('bi-box-arrow-up-right');
				deployedA.insertAdjacentText('beforeend', ` Link: ${d.link}`);
			}
			deployedP.appendChild(deployedA);
			div.appendChild(deployedP);
			divObj.els.push(deployedP);
		}

		if (d.github != null) {
			const githubP = document.createElement('p');
			const githubA = document.createElement('a');
			githubA.href = d.github;
			githubA.target = '_blank';
			const gIcon = document.createElement('i');
			gIcon.classList.add('bi', 'bi-github');
			githubA.insertAdjacentElement('afterbegin', gIcon);
			githubA.insertAdjacentText('beforeend', ` GitHub: ${d.github}`);
			githubP.appendChild(githubA);
			div.appendChild(githubP);
			divObj.els.push(githubP);
		}

		if (i === 0) {
			// set first elIdx to indicate all elements scrolled in
			ELEMENTS.elIdx = divObj.els.length - 1;
		} else {
			// set second through last elements to hidden
			for (let e of divObj.els) {
				e.classList.add('hide_right');
			}
		}
	}
}


const SCROLL_SPEEDS = [5, 6.25, 10, 12.5, 20, 25];
let scrollSpeed = SCROLL_SPEEDS[Math.floor(SCROLL_SPEEDS.length / 2)];

function roundToNearest(num, arr) {
	// round num to nearest value in arr
	let closest = arr[0];
	let closestDiff = Math.abs(num - closest);

	for (let i = 1; i < arr.length; i++) {
		const diff = Math.abs(num - arr[i]);
		if (diff < closestDiff) {
			closestDiff = diff;
			closest = arr[i];
		}
	}

	return closest;
}


function onScrollSpeedChange(evt) {
	// change scroll speed based on range input
	const val = evt.target.value;

	scrollSpeed = roundToNearest(val, SCROLL_SPEEDS);
	evt.target.value = scrollSpeed;
}


function onScroll(evt) {
	// scroll elements out of and into view

	// evt.deltaY > 0 means wheel down
	// 100 % incr === 0
	const incr = evt.deltaY > 0 ? -1 * scrollSpeed : scrollSpeed;

	const divObj = ELEMENTS.divs[ELEMENTS.divIdx];

	// check if scrolling down
	if (incr < 0) {

		// check if all sub-elements are scrolled into view
		if (ELEMENTS.elIdx === divObj.els.length - 1 && ELEMENTS.xScroll === 0) {

			// check if on last div
			if (ELEMENTS.divIdx === ELEMENTS.divs.length - 1) {
				// can't scroll down any farther
				return;
			}

			// scroll down
			const newY = ELEMENTS.yScroll + incr;

			if (newY >= 0) {
				ELEMENTS.yScroll = newY;
				divObj.div.style.height = `${newY}%`;
			} else {
				divObj.div.classList.add('d_none');

				ELEMENTS.divIdx++;
				ELEMENTS.yScroll = 100;
				ELEMENTS.elIdx = 0;
				ELEMENTS.xScroll = 100;

				const nextDivObj = ELEMENTS.divs[ELEMENTS.divIdx];
				nextDivObj.div.classList.remove('d_none');
			}
		} else { // else not all sub-elements are scrolled in
			// scroll across
			const newX = ELEMENTS.xScroll + incr;

			if (newX >= 0) {
				ELEMENTS.xScroll = newX;
				const el = divObj.els[ELEMENTS.elIdx];
				el.style.marginLeft = `${newX}vw`;
			} else {
				ELEMENTS.xScroll = 100;
				ELEMENTS.elIdx++;
			}
		}
	} else { // else scrolling up
		// check if on first div and div is at 100% height
		if (ELEMENTS.divIdx === 0 && ELEMENTS.yScroll === 100) {
			// can't scroll up any farther
			return;
		}

		// check if div height < 100% or all sub-elements are scrolled out of view
		if (ELEMENTS.yScroll < 100 || ELEMENTS.elIdx === 0 && ELEMENTS.xScroll === 100) {
			// scroll up
			const newY = ELEMENTS.yScroll + incr;

			if (newY <= 100) {
				ELEMENTS.yScroll = newY;
				divObj.div.style.height = `${newY}%`;
			} else {
				ELEMENTS.yScroll = 0;
				ELEMENTS.xScroll = 0;
				
				ELEMENTS.divIdx--;
				const prevDivObj = ELEMENTS.divs[ELEMENTS.divIdx];
				ELEMENTS.elIdx = prevDivObj.els.length - 1;
				prevDivObj.div.classList.remove('d_none');
			}
		} else { // else not all sub-elements are scrolled out
			// scroll back
			const newX = ELEMENTS.xScroll + incr;

			if (newX <= 100) {
				ELEMENTS.xScroll = newX;
				const el = divObj.els[ELEMENTS.elIdx];
				el.style.marginLeft = `${newX}vw`;
			} else {
				ELEMENTS.xScroll = 0;
				ELEMENTS.elIdx--;
			}
		}

	}
}


// touchY is used to track the Y position of the touch event
let touchY = 0;

function onTouchMove(evt) {
	// determine if scrolling on touchscreen and pass on to onScroll

	// only one-finger scroll
	if (evt.changedTouches.length === 1) {
		const y = evt.changedTouches[0].clientY;

		if (y < touchY) {
			// scroll down
			onScroll({ deltaY: 1});
		} else {
			// scroll up
			onScroll({ deltaY: -1 });
		}

		touchY = y;
	}
}


(function main() {
	window.addEventListener('wheel', onScroll, { passive: true });
	window.addEventListener('touchmove', onTouchMove);

	// get text JSON from /static
	fetch('/static/json/index.json')
		.then((response) => response.json())
		.then((data) => { initText(data); })
		.catch((error) => { console.error('Error:', error) });

	const scrollSpeedInput = document.getElementById('scroll_speed');
	scrollSpeedInput.addEventListener('input', onScrollSpeedChange);
	scrollSpeedInput.min = SCROLL_SPEEDS[0];
	scrollSpeedInput.value = scrollSpeed;
	scrollSpeedInput.max = SCROLL_SPEEDS[SCROLL_SPEEDS.length - 1];

	const speedValues = document.getElementById('speed_values');
	for (let i = 0; i < SCROLL_SPEEDS.length; i++) {
		const option = document.createElement('option');
		option.value = SCROLL_SPEEDS[i];
		speedValues.appendChild(option);
	}
})();
