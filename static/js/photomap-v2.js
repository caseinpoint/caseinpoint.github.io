let CURRENT_ID;

async function listDriveFiles(query, accessToken) {
	const url = 'https://www.googleapis.com/drive/v3/files?'
	const params = new URLSearchParams({ q: query });

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


async function handleSelect(select, accessToken) {
	const alert = document.getElementById('folders_alert');
	alert.classList.add('d-none');

	if (select.value === 'null' || select.value === CURRENT_ID) return;

	const loading = document.getElementById('folders_loading');
	loading.classList.remove('d-none');

	const query = `'${select.value}' in parents`;
	const fileArray = await listDriveFiles(query, accessToken);

	if (fileArray.length === 0) {
		loading.classList.add('d-none');
		alert.classList.remove('d-none');
		return;
	}

	if (PHOTOS.length > 0) {
		clearPhotoURLs();
		clearMarkers();
	}
	BOUNDS = {
		north: undefined,
		east: undefined,
		south: undefined,
		west: undefined,
	};

	for (let file of fileArray) {
		downloadDriveFile(file.id, accessToken)
		.then(blob => {
			blob.name = file.name;
			createPhotoObj(blob)
			.then(photo => {
				if (photo) {
					photo.idx = PHOTOS.length;
					PHOTOS.push(photo);
					createMarker(photo);
				}
			});
		});
	}

	loading.classList.add('d-none');
	const offcanvasEl = document.getElementById('settings_offcanvas');
	const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
	offcanvas.hide();
	CURRENT_ID = select.value;
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
		select.appendChild(option);
	}
	select.addEventListener('change', (evt) => handleSelect(evt.target, accessToken));
	select.classList.remove('d-none');

	const loading = document.getElementById('folders_loading');
	loading.classList.add('d-none');
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

	for (let button of document.getElementsByClassName('photo_seek')) {
		button.addEventListener('click', () => handleSeek(button));
	}
})();
