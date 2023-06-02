'use strict';

// Google oauth required
const ACCESS_TOKEN = checkOAuth();

// "Selfies" album id
const ALBUM_ID = 'AFcmz6DlGl6r_sdivkYO7ahqZsmBSAeBHvTe1UuYEq7STWLsYor-Pun9ZMzmHMSY_526lQm6gsMH'

// list albums once to find "Selfies" album id:
/*
fetch('https://photoslibrary.googleapis.com/v1/albums', {
	method: 'get',
	headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + accessToken,
	},
})
	.then((res) => res.json())
	.then((data) => console.log(data))
*/


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


async function getAllAlbumPhotos(accessToken, albumId) {
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
	const urlCurrent = photosArr[0].baseUrl;
	const widthCurrent = photosArr[0].mediaMetadata.width;
	const heightCurrent = photosArr[0].mediaMetadata.height;

	const imgCurrent = document.createElement('img');
	imgCurrent.classList.add('img-fluid');
	imgCurrent.id = 'img_current';
	imgCurrent.src = `${urlCurrent}=w${widthCurrent}-h${heightCurrent}`;
	

	const carousel = document.getElementById('carousel');
	carousel.appendChild(imgCurrent);
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
	const allPhotos = await getAllAlbumPhotos(ACCESS_TOKEN, ALBUM_ID);
	console.log(allPhotos);
	
	initImgs(allPhotos);
})()