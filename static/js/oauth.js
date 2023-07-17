'use strict';

// handle Google oauth callback
if (location.hash !== '') {
	const hash = location.hash.slice(1);
	const tokens = hash.split('&');

	for (let token of tokens) {
		const [key, value] = token.split('=');
		if (key === 'access_token') {
			localStorage.setItem(key, value);
		} else if (key === 'expires_in') {
			const expireMilli = Number(value) * 1000;
			const expireTime = new Date(Date.now() + expireMilli);
			localStorage.setItem('expires_at', expireTime.toISOString());
		}
	}

	const cleanURL = location.origin + location.pathname;
	location.replace(cleanURL);
}


function checkOAuth() {
	// if access_token is missing or expired return null

	let expiresAt = localStorage.getItem('expires_at');

	if (expiresAt === null) return null;

	expiresAt = new Date(expiresAt);
	const now = new Date();
	if (now >= expiresAt) return null;

	const accessToken = localStorage.getItem('access_token');
	return accessToken;
}


// create Google oauth form and submit on button click
const googleBtn = document.getElementById('google_btn');
if (googleBtn !== null) {
	googleBtn.addEventListener('click', () => {
		const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

		const form = document.createElement('form');
		form.setAttribute('method', 'GET');
		form.setAttribute('action', oauth2Endpoint);

		const params = {
			'client_id': googleBtn.dataset.client_id,
			'redirect_uri': location.origin + location.pathname,
			'response_type': 'token',
			'scope': googleBtn.dataset.scope,
			'include_granted_scopes': 'true',
			'state': 'pass-through value'
		};

		for (let p in params) {
			const input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			input.setAttribute('name', p);
			input.setAttribute('value', params[p]);
			form.appendChild(input);
		}

		document.body.appendChild(form);
		form.submit();
	});
}