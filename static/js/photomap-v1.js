function handleForm(evt) {
	evt.preventDefault();

	const filesInput = document.getElementById('files_input');
	if (filesInput.files.length === 0) return;

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

	for (let file of filesInput.files) {
		createPhotoObj(file)
		.then(photo => {
			if (photo) {
				photo.idx = PHOTOS.length;
				PHOTOS.push(photo);
				createMarker(photo);
			}
		});
	}

	filesInput.value = '';

	const offcanvasEl = document.getElementById('settings_offcanvas');
	const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
	offcanvas.hide();
}


(async function main() {
	initMap();

	const form = document.getElementById('files_form');
	form.addEventListener('submit', handleForm);

	for (let button of document.getElementsByClassName('photo_seek')) {
		button.addEventListener('click', () => handleSeek(button));
	}
})();
