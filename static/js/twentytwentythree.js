'use strict';

let PHOTOS = [];


function checkOAuth() {
	// if access_token is missing or expired redirect to login page

	const accessToken = localStorage.getItem('access_token');

	if (accessToken === null) {
		location.assign('/#access_expired=true');
	} else {
		const now = new Date();
		let expiresAt = localStorage.getItem('expires_at');
		expiresAt = new Date(expiresAt);
		if (now > expiresAt) {
			location.assign('/#access_expired=true');
		}
	}

	return accessToken;
}


async function getAlbums(endpoint, accessToken) {
	const url = `https://photoslibrary.googleapis.com/v1/${endpoint}`;
	const response = await fetch(url, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + accessToken,
		},
	});
	const data = await response.json();
	return data[endpoint];
}


async function handleAlbumBtn(btn, accessToken) {
	PHOTOS = await getAlbumPhotosAll(accessToken, btn.value);
	initImgs(PHOTOS);
}


async function initAlbumBtns(accessToken) {
	for (let div of document.getElementsByClassName('albums_btns')) {
		const endpoint = div.dataset.endpoint;
		const albums = await getAlbums(endpoint, accessToken);
		for (let album of albums) {
			const btn = document.createElement('button');

			btn.classList.add('list-group-item', 'list-group-item-action');
			btn.value = album.id;
			btn.dataset.bsDismiss = 'offcanvas';
			btn.innerText = album.title;

			btn.addEventListener('click', () => {
				handleAlbumBtn(btn, accessToken)
			})

			div.appendChild(btn);
		}
	}

	document.getElementById('albums_loading').classList.add('d-none');
	document.getElementById('albums_accordion').classList.remove('d-none');
}


async function getAlbumPhotosPage(accessToken, albumId, pageToken=null) {
	const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';
	const params = {
		pageSize: 100,
		albumId: albumId,
	};
	if (pageToken !== null) params.pageToken = pageToken;

	const response = await fetch(url, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + accessToken,
		},
		body: JSON.stringify(params),
	});

	const result = await response.json();
	return result
}


async function getAlbumPhotosAll(accessToken, albumId) {
	let allPhotos = [];
	
	let albumResults = await getAlbumPhotosPage(accessToken, albumId);
	
	let mediaItems = albumResults.mediaItems;
	allPhotos = allPhotos.concat(mediaItems);
	
	let nextPageToken = albumResults.nextPageToken;
	while (nextPageToken) {
		albumResults = await getAlbumPhotosPage(accessToken, albumId, nextPageToken);

		mediaItems = albumResults.mediaItems;
		allPhotos = allPhotos.concat(mediaItems);
	
		nextPageToken = albumResults.nextPageToken;
	}
	
	return allPhotos;
}


function initImgs(photosArr) {
	const carousel = document.getElementById('carousel');
	carousel.innerHTML = '';

	for (let id of ['prev', 'current', 'next']) {
		let i = photosArr.length - 1;
		if (id === 'current') i = 0;
		else if (id === 'next') i = 1;

		const baseUrl = photosArr[i].baseUrl;
		const width = photosArr[i].mediaMetadata.width;
		const height = photosArr[i].mediaMetadata.height;

		const img = document.createElement('img');
		img.classList.add('img-fluid');
		if (id !== 'current') img.classList.add('d-none')
		img.id = `img_${id}`;
		img.src = `${baseUrl}=w${width}-h${height}`;
		img.dataset.index = i;

		carousel.appendChild(img);
	}
}


function nextImg(photosArr) {
	const prevImg = document.getElementById('img_prev');
	const currentImg = document.getElementById('img_current');
	const nextImg = document.getElementById('img_next');

	prevImg.remove();

	currentImg.id = 'img_prev';
	currentImg.classList.add('d-none');

	nextImg.id = 'img_current';
	nextImg.classList.remove('d-none');
	const nextIdx = Number(nextImg.dataset.index)

	const newIdx = nextIdx < (photosArr.length - 1) ? nextIdx + 1 : 0;
	const newNext = document.createElement('img');
	newNext.classList.add('img-fluid', 'd-none');
	newNext.id = 'img_next'
	newNext.dataset.index = newIdx;
	const baseUrl = photosArr[newIdx].baseUrl;
	const width = photosArr[newIdx].mediaMetadata.width;
	const height = photosArr[newIdx].mediaMetadata.height;
	newNext.src = `${baseUrl}=w${width}-h${height}`;

	const carousel = document.getElementById('carousel');
	carousel.appendChild(newNext);
}


function prevImg(photosArr) {
	const prevImg = document.getElementById('img_prev');
	const currentImg = document.getElementById('img_current');
	const nextImg = document.getElementById('img_next');

	nextImg.remove();

	currentImg.id = 'img_next';
	currentImg.classList.add('d-none');

	prevImg.id = 'img_current';
	prevImg.classList.remove('d-none');
	const prevIdx = Number(prevImg.dataset.index);

	const newIdx = prevIdx > 0 ? prevIdx - 1 : photosArr.length - 1;
	const newPrev = document.createElement('img');
	newPrev.classList.add('img-fluid', 'd-none');
	newPrev.id = 'img_prev'
	newPrev.dataset.index = newIdx;
	const baseUrl = photosArr[newIdx].baseUrl;
	const width = photosArr[newIdx].mediaMetadata.width;
	const height = photosArr[newIdx].mediaMetadata.height;
	newPrev.src = `${baseUrl}=w${width}-h${height}`;

	const carousel = document.getElementById('carousel');
	carousel.appendChild(newPrev);
}


function play(delay, photosArr) {
	const intervalID = setInterval(nextImg, delay * 1000, photosArr);
	return intervalID;
}

function pause(intervalID) {
	clearInterval(intervalID);
}


function compareRandom(a, b) {
	return 0.5 - Math.random();
}

function comparePhotoDate(a, b) {
	const aDate = new Date(a.mediaMetadata.creationTime);
	const bDate = new Date(b.mediaMetadata.creationTime);
	return aDate - bDate;
}

function sortPhotos(photosArr, method) {
	if (method === 'date') {
		photosArr.sort(comparePhotoDate)
	} else if (method === 'random') {
		photosArr.sort(compareRandom);
	}
}


(async function main() {
	const accessToken = checkOAuth();

	initAlbumBtns(accessToken);

	let delay = 2;
	let intervalID = null;

	for (let btn of document.getElementsByClassName('sort_btn')) {
		btn.addEventListener('click', () => {
			sortPhotos(PHOTOS, btn.value);
			initImgs(PHOTOS);

			const check = document.getElementById('sort_check');
			btn.appendChild(check);

			if (intervalID) {
				pause(intervalID);
				intervalID = play(delay, PHOTOS);
			}
		});
	}

	for (let btn of document.getElementsByClassName('delay_btn')) {
		btn.addEventListener('click', () => {
			delay = Number(btn.value);

			const check = document.getElementById('delay_check');
			btn.appendChild(check);

			if (intervalID) {
				pause(intervalID);
				intervalID = play(delay, PHOTOS);
			}
		});
	}

	for (let btn of document.getElementsByClassName('control_btn')) {
		if (btn.value === 'next') {
			btn.addEventListener('click', () => nextImg(PHOTOS));
		} else if (btn.value === 'prev') {
			btn.addEventListener('click', () => prevImg(PHOTOS));
		} else if (btn.value === 'play') {
			btn.addEventListener('click', () => {
				intervalID = play(delay, PHOTOS);

				btn.classList.add('d-none');
				document.querySelector('[value="pause"]').classList.remove('d-none');
			});
		} else if (btn.value === 'pause') {
			btn.addEventListener('click', () => {
				pause(intervalID);
				intervalID = null;

				btn.classList.add('d-none');
				document.querySelector('[value="play"]').classList.remove('d-none');
			});
		}
	}
})()