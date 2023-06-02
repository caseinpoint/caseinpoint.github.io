'use strict';

// create Google oauth form and submit on button click
document.getElementById('google_btn').addEventListener('click', () => {
	const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

	const form = document.createElement('form');
	form.setAttribute('method', 'GET');
	form.setAttribute('action', oauth2Endpoint);

	const params = {
		'client_id': '939201652009-kego5b5caevfnugaftv7dj8l2dqee429.apps.googleusercontent.com',
		'redirect_uri': 'http://127.0.0.1:5500',
		'response_type': 'token',
		'scope': 'https://www.googleapis.com/auth/photoslibrary.readonly',
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
		} else if (key === 'access_expired') {
			const alert = document.getElementById('google_alert');
			alert.classList.remove('d-none');
		}
	}
}