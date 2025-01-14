const MAIN_ELEMENT = document.getElementById('main_content');
const ELEMENTS = {
	divIdx: 0,
	divs: []
};


function initText(data) {
	// initialize text elements from static JSON data array

	for (i = 0; i < data.length; i++) {
		const d = data[i];

		// create object to track elements and scroll position
		const divObj = {
			div: null,
			elIdx: 0,
			els: [],
			scroll: 0
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

		// set first div to display, others hidden
		if (i === 0) {
			// set up scrolling of next object
			divObj.elIdx = divObj.els.length;
			divObj.scroll = 100;
		} else {
			div.classList.add('d_none');
			for (let e of divObj.els) {
				e.classList.add('hide_right');
			}
		}
	}
}


function onScroll(evt) {
	evt.preventDefault();
	console.log(evt.deltaY);
}


(function main() {
	// get text JSON from /static
	fetch('/static/json/index.json')
		.then((response) => response.json())
		.then((data) => { initText(data); })
		.catch((error) => { console.error('Error:', error) });

	MAIN_ELEMENT.addEventListener('wheel', onScroll);
})();
