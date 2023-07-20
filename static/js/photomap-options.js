const mapOptions = {
	center: { lat: 47.114854, lng: -101.297808 },
	zoom: 3,
	mapTypeId: 'satellite',
	disableDefaultUI: true,
	// fullscreenControl: true,
	styles: [
		{ featureType: 'poi', stylers: [{ visibility: 'off' }]},
		{ featureType: 'transit', stylers: [{ visibility: 'off' }]},
	],
};