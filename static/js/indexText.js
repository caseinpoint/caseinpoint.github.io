function initText(data) {
	// initialize text elements from static JSON data

	console.log(data);
}


(function main() {
	// get text JSON from /static
	fetch('/static/json/index.json')
		.then((response) => response.json())
		.then((data) => { initText(data); })
		.catch((error) => { console.error('Error:', error) });
})();