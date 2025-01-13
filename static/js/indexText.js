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

		const div = document.createElement('div');
		div.classList.add('data_div');
		// if (i > 0) { div.classList.add('d_none'); }
		MAIN_ELEMENT.appendChild(div);
		divObj.div = div;
	}
}


function onScroll(evt) {
	evt.preventDefault();
	console.log(evt);
}


(function main() {
	// get text JSON from /static
	fetch('/static/json/index.json')
		.then((response) => response.json())
		.then((data) => { initText(data); })
		.catch((error) => { console.error('Error:', error) });

	MAIN_ELEMENT.addEventListener('wheel', onScroll);
})();
