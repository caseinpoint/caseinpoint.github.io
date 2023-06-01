'use strict';

String.prototype.hashCode = function() {
	let hash = 0;
	if (this.length === 0) return hash;
	for (let i = 0; i < this.length; i++) {
		let chr = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;
	}
	return hash;
}

document.getElementById('secret_form').addEventListener('submit', (evt) => {
	evt.preventDefault();

	const pw = document.getElementById('secret_pw').value;
	if (pw.hashCode() === -1979635712) {
		window.location.assign('/anniversary/anniversaries.html');
	} else {
		const nope = document.createElement('div');
		nope.classList.add('alert', 'alert-danger');
		nope.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Nope';

		const alertPlaceholder = document.getElementById('alert_placeholder');
		alertPlaceholder.append(nope)
	}
});
