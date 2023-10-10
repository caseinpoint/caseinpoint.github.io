function resizeTextarea(textArea) {
	const lines = textArea.value.split('\n');

	if (lines.length < 3) textArea.setAttribute('rows', 3);
	else if (lines.length > 13) textArea.setAttribute('rows', 13);
	else textArea.setAttribute('rows', lines.length);
}


function initCount() {
	let storedCount = localStorage.getItem('count');
	if (storedCount === null) {
		storedCount = '0';
		localStorage.setItem('count', storedCount);
	}

	// TODO: then set counter element text to storedCount
}


function initPattern(textArea) {
	localStorage.setItem('pattern', textArea.value);

	const lines = textArea.value.split('\n');
}


(function main() {
	// const body = document.querySelector('body');
	// body.addEventListener('keydown', (evt) => console.log(evt));

	initCount();

	const textArea = document.getElementById('pattern_npt');

	const storedPattern = localStorage.getItem('pattern');
	if (storedPattern !== null) textArea.value = storedPattern;

	textArea.addEventListener('keydown', (evt) => evt.stopPropagation());
	textArea.addEventListener('input', () => resizeTextarea(textArea));

	const patternBtn = document.getElementById('pattern_btn');
	patternBtn.addEventListener('click', () => initPattern(textArea));
})();
