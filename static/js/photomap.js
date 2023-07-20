let GOOGLE_MAP;
let PHOTOS = [];
let MARKERS = [];


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


async function initMap() {
	const { Map } = await google.maps.importLibrary('maps');
	const { ControlPosition } = await google.maps.importLibrary('core');

	GOOGLE_MAP = new Map(document.getElementById('map'), mapOptions);

	const canvasControl = createOffcanvasControl();
	GOOGLE_MAP.controls[ControlPosition.TOP_LEFT].push(canvasControl);
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


async function handleSelect(select, accessToken) {
	if (select.value === 'null') return;

	const query = `'${select.value}' in parents`;
	const photosData = await listDriveFiles(query, accessToken);

	const photos = [];
	for (let data of photosData) {
		const blob = await downloadDriveFile(data.id, accessToken);
		const url = URL.createObjectURL(blob);

		const exif = EXIF.readFromBinaryFile(await blob.arrayBuffer());
		const coords = {};
		coords.lat = dmsToDec(...exif.GPSLatitude, exif.GPSLatitudeRef);
		coords.lng = dmsToDec(...exif.GPSLongitude, exif.GPSLongitudeRef);

		photos.push({blob, url, coords});
	}
	console.log(photos);
}


async function initFolders(accessToken) {
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