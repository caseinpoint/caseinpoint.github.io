const MAIN_ELEMENT = document.getElementById('main_content');
const ELEMENTS = {
	divIdx: 0,
	divs: []
};


function initText(data) {
	// initialize text elements from static JSON object array

	for (i = 0; i < data.length; i++) {
		const d = data[i];

		// create object to track elements and scroll position
		const divObj = {
			div: null,
			divScroll: 100,
			elIdx: 0,
			els: [],
			elScroll: 0
		};
		ELEMENTS.divs.push(divObj);

		// create elements
		const div = document.createElement('div');
		div.classList.add('data_div');
		MAIN_ELEMENT.appendChild(div);
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
			const gIcon = document.createElement('i');
			gIcon.classList.add('bi', 'bi-github');
			githubA.insertAdjacentElement('afterbegin', gIcon);
			githubA.insertAdjacentText('beforeend', ` GitHub: ${d.github}`);
			githubP.appendChild(githubA);
			div.appendChild(githubP);
			divObj.els.push(githubP);
		}

		// set first div to display, others hidden
		if (i === 0) {
			// set up scrolling of next object
			divObj.elIdx = divObj.els.length;
			divObj.elScroll = 100;
		} else {
			div.classList.add('d_none');
			for (let e of divObj.els) {
				e.classList.add('hide_right');
			}
		}
	}
}


function onScroll(evt) {
	// scroll elements out of and view

	evt.preventDefault();

	const incr = evt.deltaY > 0 ? -1 : 1;
}


(function main() {
	// get text JSON from /static
	fetch('/static/json/index.json')
		.then((response) => response.json())
		.then((data) => { initText(data); })
		.catch((error) => { console.error('Error:', error) });

	MAIN_ELEMENT.addEventListener('wheel', onScroll);
})();
