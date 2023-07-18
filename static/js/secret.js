'use strict';

const SECRET_HASH = -1979635712;

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

const secretForm = document.getElementById('secret_form');
if (secretForm !== null) {
	secretForm.addEventListener('submit', (evt) => {
		evt.preventDefault();

		const pw = document.getElementById('secret_pw').value;
		if (pw.hashCode() === SECRET_HASH) {
			sessionStorage.setItem('secret_login', 'this_is_kiki')
			window.location.assign('/anniversary');
		} else {
			const nope = document.createElement('div');
			nope.classList.add('alert', 'alert-danger');
			nope.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Nope';

			const alertPlaceholder = document.getElementById('alert_placeholder');
			alertPlaceholder.appendChild(nope);
		}
	});
}


function checkSecret() {
	// if kiki_token not in sessionStorage, redirect to homepage

	const secretLogin = sessionStorage.getItem('secret_login');
	if (secretLogin === null || secretLogin !== 'this_is_kiki') {
		location.replace(location.origin);
	}
}
