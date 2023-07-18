let map;


function createOffcanvasControl() {
	const button = document.createElement('button');

	button.classList.add('btn', 'btn-dark', 'm-2');
	button.type = 'button';
	button.dataset.bsToggle = 'offcanvas';
	button.dataset.bsTarget = '#albums_offcanvas';
	button.innerHTML = '<i class="bi bi-gear-fill"></i>';

	const div = document.createElement('div');
	div.appendChild(button);

	return div;
}


async function initMap() {
	const { Map } = await google.maps.importLibrary('maps');
	const { ControlPosition } = await google.maps.importLibrary('core');

	map = new Map(document.getElementById('map'), mapOptions);

	const canvasControl = createOffcanvasControl();
	map.controls[ControlPosition.TOP_LEFT].push(canvasControl);
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
})();