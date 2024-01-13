function getCategoryArray() {
	/* Get a new, shuffled array of spell categories */

	const categories = ['atk', 'atk', 'def', 'def', 'icn', 'icn'];

	for (let n = 0; n < 3; n++) {
		for (let i in categories) {
			const r = Math.floor(Math.random() * categories.length);
			[categories[i], categories[r]] = [categories[r], categories[i]];
		}
	}

	return categories;
}

function SpellsTracker(props) {
	/* React compmponent: Track daily/per battle spells for character level */

	// useEffect to load most recent values from localStorage
	// full heal-up button to reset
}

function OptionsMenu(props) {
	/* React component: Select character talents and feats */

	// useEffect to load previous selections form localStorage
}

function Root(props) {
	/* Root React component */

	return (
		<div className="container-fluid">
			<h1>Testing</h1>
		</div>
	);
}

ReactDOM.render(<Root />, document.getElementById('react_app'));
