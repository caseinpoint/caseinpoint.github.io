function resizeCanvas() {
	/* fit canvas to window size */

	const canvas = document.getElementById('main_canvas');
	const ctx = canvas.getContext('2d');

	ctx.canvas.height = window.innerHeight;
	ctx.canvas.width = window.innerWidth;
}

// initialize canvas size
resizeCanvas();

// resize canvas if window changes
window.addEventListener('resize', () => {
	resizeCanvas();
});