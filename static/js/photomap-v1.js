// Google classes will be initialized async
// AdvancedMarkerElement, PinElement
let AME, PE;

// global map instance
let GOOGLE_MAP;

const PHOTOS = [];
const MARKERS = [];
let MARKERCLUSTER;
let BOUNDS = { north: 69, east: -66, south: 24, west: -165, };
const BOUNDS_PADDING = 50;


function toggleFullscreen() {
	const button = document.getElementById('ctrl_fullscreen');
	if (!document.fullscreenElement) {
		const body = document.querySelector('body');
		body.requestFullscreen();
		button.innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
	} else if(document.exitFullscreen) {
		document.exitFullscreen();
		button.innerHTML = '<i class="bi bi-fullscreen"></i>';
	}
}


function resetBounds() {
	GOOGLE_MAP.fitBounds(BOUNDS, BOUNDS_PADDING);
}


function createControl(id, bsClass, handler, dataset) {
	const button = document.createElement('button');

	button.id = id;
	button.classList.add('btn', 'btn-dark', 'm-2');
	button.type = 'button';
	button.innerHTML = `<i class="bi bi-${bsClass}"></i>`;

	if (handler) button.addEventListener('click', handler);

	if (dataset) {
		for (let [key, val] of Object.entries(dataset)) {
			button.dataset[key] = val;
		}
	}

	const div = document.createElement('div');
	div.appendChild(button);
	return div;
}


async function initMap() {
	const { Map } = await google.maps.importLibrary('maps');
	const { ControlPosition } = await google.maps.importLibrary('core');

	// these will be assigned globally to be used later
	const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker');
	AME = AdvancedMarkerElement;
	PE = PinElement;

	GOOGLE_MAP = new Map(document.getElementById('map'), mapOptions);

	MARKERCLUSTER = new markerClusterer.MarkerClusterer({
		map: GOOGLE_MAP,
		markers: MARKERS,
	});

	const canvasControl = createControl('ctrl_canvas', 'gear-fill', null,
		{ bsToggle: 'offcanvas', bsTarget: '#settings_offcanvas' });
	GOOGLE_MAP.controls[ControlPosition.TOP_LEFT].push(canvasControl);

	const fullscreenControl = createControl('ctrl_fullscreen', 'fullscreen',
		toggleFullscreen, null);
	GOOGLE_MAP.controls[ControlPosition.TOP_RIGHT].push(fullscreenControl);
	// const body = document.querySelector('body');
	// body.addEventListener('fullscreenchange', resetBounds);


	const boundsControl = createControl('ctrl_bounds', 'bounding-box-circles',
		resetBounds, null);
	GOOGLE_MAP.controls[ControlPosition.RIGHT_BOTTOM].push(boundsControl);

	for (let btn of document.getElementsByName('map_style')) {
		btn.addEventListener('click', () => GOOGLE_MAP.setMapTypeId(btn.id));
	}
}


function dmsToDec(d, m, s, ref) {
	let decimal = d + m/60 + s/3600;
	if (ref === 'S' || ref === 'W') decimal *= -1;
	return decimal;
}


function clearPhotoURLs() {
	while (PHOTOS.length > 0) {
		const photo = PHOTOS.pop();
		URL.revokeObjectURL(photo.url);
	}
}


function clearMarkers() {
	while (MARKERS.length > 0) {
		const marker = MARKERS.pop();
		MARKERCLUSTER.removeMarker(marker, true);
		marker.map = null;
	}
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


async function createPhotoObj(blob) {
	const url = URL.createObjectURL(blob);

	const exif = EXIF.readFromBinaryFile(await blob.arrayBuffer());
	if (!exif || !exif.GPSLatitude) return;

	const coords = {};
	coords.lat = dmsToDec(...exif.GPSLatitude, exif.GPSLatitudeRef);
	coords.lng = dmsToDec(...exif.GPSLongitude, exif.GPSLongitudeRef);

	return {blob, url, coords, datetime: exif.DateTime};
}


function updateBounds({lat, lng}) {
	let boundsChanged = false;

	if (BOUNDS.north === undefined || lat > BOUNDS.north) {
		BOUNDS.north = lat;
		boundsChanged = true;
	}
	if (BOUNDS.south === undefined || lat < BOUNDS.south) {
		BOUNDS.south = lat;
		boundsChanged = true
	}
	if (BOUNDS.east === undefined || lng > BOUNDS.east) {
		BOUNDS.east = lng;
		boundsChanged = true;
	}
	if (BOUNDS.west === undefined || lng < BOUNDS.west) {
		BOUNDS.west = lng;
		boundsChanged = true;
	}

	if (boundsChanged) resetBounds();
}


function createMarker(photo) {
	const icon = document.createElement('div');
	icon.innerHTML = '<i class="bi bi-camera-fill h4"></i>';
	const pin = new PE({
		glyph: icon,
		glyphColor: '#246EB9',
		background: '#6EB4C1',
		borderColor: '#30352F',
		scale: 1.25,
	});

	const marker = new AME({
		map: GOOGLE_MAP,
		position: photo.coords,
		content: pin.element,
	});

	marker.addListener('click', () => handleMarkerClick(photo));

	MARKERCLUSTER.addMarker(marker);

	MARKERS.push(marker);

	updateBounds(photo.coords);
}


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
})();