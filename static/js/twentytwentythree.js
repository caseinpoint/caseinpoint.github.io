'use strict';

// Google oauth required
const ACCESS_TOKEN = checkOAuth();

// "Selfies" album id
const ALBUM_ID = 'AFcmz6DlGl6r_sdivkYO7ahqZsmBSAeBHvTe1UuYEq7STWLsYor-Pun9ZMzmHMSY_526lQm6gsMH'

function checkOAuth() {
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

// list albums once to find "Selfies" album id
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
	
	let albumResults = await getAlbumPhotosPage(ACCESS_TOKEN, ALBUM_ID);
	console.log(albumResults);
	let mediaItems = albumResults.mediaItems;
	allPhotos = allPhotos.concat(mediaItems);
	
	let nextPageToken = albumResults.nextPageToken;
	while (nextPageToken) {
		let nextResults = await getAlbumPhotosPage(ACCESS_TOKEN, ALBUM_ID, nextPageToken);
		mediaItems = nextResults.mediaItems;
		allPhotos = allPhotos.concat(mediaItems);
	
		nextPageToken = nextResults.nextPageToken;
	}
	
	return allPhotos;
}

const allPhotos = getAllAlbumPhotos(ACCESS_TOKEN, ALBUM_ID);
console.log(allPhotos);