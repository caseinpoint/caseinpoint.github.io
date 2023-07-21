let GOOGLE_MAP;
let PHOTOS = [];
let MARKERS = [];
let BOUNDS = {
	north: 68.87315,
	east: -66.98511,
	south: 24.55540,
	west: -166.08958,
};
const BOUNDS_PADDING = 50;


function createOffcanvasControl() {
	const button = document.createElement('button');

	button.classList.add('btn', 'btn-dark', 'm-2');
	button.type = 'button';
	button.dataset.bsToggle = 'offcanvas';
	button.dataset.bsTarget = '#settings_offcanvas';
	button.innerHTML = '<i class="bi bi-gear-fill"></i>';

	const div = document.createElement('div');
	div.appendChild(button);
	return div;
}


function toggleFullscreen(button) {
	if (!document.fullscreenElement) {
		const body = document.querySelector('body');
		body.requestFullscreen();
		button.innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
	} else if(document.exitFullscreen) {
		document.exitFullscreen();
		button.innerHTML = '<i class="bi bi-fullscreen"></i>';
	}
}


function createFullscreenControl() {
	const button = document.createElement('button');

	button.classList.add('btn', 'btn-dark', 'm-2');
	button.type = 'button';
	button.innerHTML = '<i class="bi bi-fullscreen"></i>';
	button.addEventListener('click', () => toggleFullscreen(button));

	const div = document.createElement('div');
	div.appendChild(button);
	return div;
}


async function initMap() {
	const { Map } = await google.maps.importLibrary('maps');
	const { ControlPosition } = await google.maps.importLibrary('core');

	GOOGLE_MAP = new Map(document.getElementById('map'), mapOptions);

	const canvasControl = createOffcanvasControl();
	GOOGLE_MAP.controls[ControlPosition.TOP_LEFT].push(canvasControl);

	const fullscreenControl = createFullscreenControl();
	GOOGLE_MAP.controls[ControlPosition.TOP_RIGHT].push(fullscreenControl);
	const body = document.querySelector('body');
	body.addEventListener('fullscreenchange', () => {
		GOOGLE_MAP.fitBounds(BOUNDS, BOUNDS_PADDING);
	});
}


async function listDriveFiles(query, accessToken) {
	const url = 'https://www.googleapis.com/drive/v3/files?'
	const params = new URLSearchParams({ q: query	});

	const response = await fetch(url + params.toString(), {
		method: 'get',
		headers: { Authorization: 'Bearer ' + accessToken, },
	});
	
	const data = await response.json();
	return data.files;
}


async function downloadDriveFile(fileId, accessToken) {
	const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
	const response = await fetch(url, {
		method: 'get',
		headers: { Authorization: 'Bearer ' + accessToken, },
	});

	const blob = await response.blob();
	return blob;
}


function dmsToDec(d, m, s, ref) {
	let decimal = d + m/60 + s/3600;
	if (ref === 'S' || ref === 'W') decimal *= -1;
	return decimal;
}


function clearPhotoURLs() {
	for (let photo of PHOTOS) {
		URL.revokeObjectURL(photo.url);
	}
}


function clearMarkers() {
	for (let marker of MARKERS) {
		marker.map = null;
	}
	MARKERS = [];
}


function parseDate(datetimeStr) {
	let [ dateStr, timeStr] = datetimeStr.split(' '); 
	dateStr = dateStr.replaceAll(':', '-');

	datetimeStr = `${dateStr}T${timeStr}`;
	return new Date(datetimeStr);
}


function handleMarkerClick(photo) {
	const photoImg = document.getElementById('photo_img');
	photoImg.src = photo.url;

	const photoDatetime = document.getElementById('photo_datetime');
	const datetime = parseDate(photo.datetime)
	photoDatetime.textContent = datetime.toLocaleString();

	const photoCoords = document.getElementById('photo_coords');
	const coordsStr = `${photo.coords.lat.toFixed(6)}, ${photo.coords.lng.toFixed(6)}`;
	photoCoords.textContent = coordsStr;

	const modal = new bootstrap.Modal('#photo_modal');
	modal.show();
}


async function createMarkers() {
	const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker');

	let minLat, maxLat, minLng, maxLng;

	for (let photo of PHOTOS) {
		const icon = document.createElement('div');
		icon.innerHTML = '<i class="bi bi-camera-fill h5"></i>';
		const pin = new PinElement({
			glyph: icon,
			glyphColor: '#246EB9',
			background: '#6EB4C1',
			borderColor: '#30352F',
			scale: 1.25,
		});

		const marker = new AdvancedMarkerElement({
			map: GOOGLE_MAP,
			position: photo.coords,
			content: pin.element,
		});

		marker.addListener('click', () => handleMarkerClick(photo));

		MARKERS.push(marker);

		const { lat, lng } = photo.coords;
		if (minLat === undefined || lat < minLat) minLat = lat;
		if (maxLat === undefined || lat > maxLat) maxLat = lat;
		if (minLng === undefined || lng < minLng) minLng = lng;
		if (maxLng === undefined || lng > maxLng) maxLng = lng;
	}

	BOUNDS = { east: maxLng, west: minLng, north: maxLat, south: minLat };
	GOOGLE_MAP.fitBounds(BOUNDS, BOUNDS_PADDING);
}


async function handleSelect(select, accessToken) {
	if (select.value === 'null') return;

	const query = `'${select.value}' in parents`;
	const photosData = await listDriveFiles(query, accessToken);

	if (photosData.length === 0) return;

	const newPhotos = [];
	for (let data of photosData) {
		const blob = await downloadDriveFile(data.id, accessToken);
		const url = URL.createObjectURL(blob);

		const exif = EXIF.readFromBinaryFile(await blob.arrayBuffer());

		const coords = {};
		coords.lat = dmsToDec(...exif.GPSLatitude, exif.GPSLatitudeRef);
		coords.lng = dmsToDec(...exif.GPSLongitude, exif.GPSLongitudeRef);

		newPhotos.push({blob, url, coords, datetime: exif.DateTime});
	}
	
	if (PHOTOS.length > 0) {
		clearPhotoURLs();
		clearMarkers();
	}

	PHOTOS = newPhotos;
	createMarkers();
}


async function initFolders(accessToken) {
	// populate offcanvas select with PHOTOMAP subfolders

	const mainQuery = "mimeType = 'application/vnd.google-apps.folder' and name = 'PHOTOMAP'"
	const mainFolders = await listDriveFiles(mainQuery, accessToken);
	const mainId = mainFolders[0].id;

	const subQuery = `mimeType = 'application/vnd.google-apps.folder' and '${mainId}' in parents`;
	const subFolders = await listDriveFiles(subQuery, accessToken);

	const select = document.getElementById('folders_select');
	for (let folder of subFolders) {
		const option = document.createElement('option');
		option.value = folder.id;
		option.textContent = folder.name;
		option.dataset.bsDismiss = 'offcanvas';
		select.appendChild(option);
	}
	select.addEventListener('change', (evt) => handleSelect(evt.target, accessToken));
	select.classList.remove('d-none');

	const loading = document.getElementById('folders_loading');
	loading.classList.add('d-none')
}


(async function main() {
	const accessToken = checkOAuth();

	if (accessToken === null) {
		const googleContainer = document.getElementById('google_container');
		googleContainer.classList.remove('d-none');

		return;
	}

	const mainContainer = document.getElementById('main_content');
	mainContainer.classList.remove('d-none');

	initMap();

	initFolders(accessToken);
})();