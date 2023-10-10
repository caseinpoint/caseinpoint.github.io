function mod(n, d) {
	return ((n % d) + d) % d;
}


function initCount() {
	let storedCount = localStorage.getItem('count');
	if (storedCount === null) {
		storedCount = '0';
		localStorage.setItem('count', storedCount);
	}

	const countEl = document.getElementById('count');
	countEl.textContent = storedCount;
}


function initPattern(textArea) {
	const storedPattern = localStorage.getItem('pattern');

	if (storedPattern !== null) {
		textArea.value = storedPattern;
		updatePattern(textArea);
	}
}


function updatePattern(textArea) {
	localStorage.setItem('pattern', textArea.value);

	const patternDiv = document.getElementById('pattern');
	patternDiv.innerHTML = '';
	const pattern = textArea.value.split('\n');

	for (let i = 0; i < pattern.length; i++) {
		const rowTxt = `R${i+1}: ${pattern[i]}`;

		const row = document.createElement('p');
		row.textContent = rowTxt;

		patternDiv.append(row);
	}

	const count = Number(localStorage.getItem('count'));
	highlightRow(count);
}


function highlightRow(count) {
	const rows = document.getElementById('pattern').children;
	const highlight = mod(count, rows.length);

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];

		if (i !== highlight) {
			row.classList.remove('h4', 'text-primary');
			row.removeAttribute('aria-current');
		} else {
			row.classList.add('h4', 'text-primary');
			row.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center'
			});
			row.setAttribute('aria-current', 'true');
		}
	}
}


function updateCount(increment=true, reset=false) {
	let count = Number(localStorage.getItem('count'));
	if (increment) count++;
	else if (count > 0) count--;
	if (reset) count = 0;
	localStorage.setItem('count', count.toString());

	const countEl = document.getElementById('count');
	countEl.textContent = count;

	highlightRow(count);
}


function handleKeydown(evt) {
	if (evt.code !== 'Space') {
		return;
	} else if (evt.ctrlKey) {
		// reset count
		updateCount(false, true);
	} else if (evt.shiftKey) {
		// decrement count
		updateCount(false);
	} else {
		// increment count
		updateCount(true);
	}
}


function resizeTextarea(textArea) {
	const lines = textArea.value.split('\n');

	if (lines.length < 3) textArea.setAttribute('rows', 3);
	// else if (lines.length > 13) textArea.setAttribute('rows', 13);
	else textArea.setAttribute('rows', lines.length);
}


(function main() {
	initCount();

	const textArea = document.getElementById('pattern_npt');
	initPattern(textArea);
	textArea.addEventListener('keydown', (evt) => evt.stopPropagation());
	textArea.addEventListener('input', () => resizeTextarea(textArea));

	const patternBtn = document.getElementById('pattern_btn');
	patternBtn.addEventListener('click', () => {
		updatePattern(textArea);
		patternBtn.blur();
	});

	const body = document.querySelector('body');
	body.addEventListener('keydown', handleKeydown);

	const incrBtn = document.getElementById('incr_btn');
	incrBtn.addEventListener('click', () => {
		updateCount(true);
		incrBtn.blur();
	});

	const decrBtn = document.getElementById('decr_btn');
	decrBtn.addEventListener('click', () => {
		updateCount(false);
		decrBtn.blur();
	});

	const resetBtn = document.getElementById('reset_btn');
	resetBtn.addEventListener('click', () => {
		updateCount(false, true);
		resetBtn.blur();
	});

	const accordionBtn = document.getElementById('accordion_btn');
	accordionBtn.addEventListener('click', () => accordionBtn.blur());
})();
