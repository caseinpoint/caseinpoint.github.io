function SpellsTracker(props) {
	/* Track daily and per battle spells based on character level */

	// useEffect to load most recent values from localStorage
	// long rest button to reset
}

function OptionsMenu(props) {
	/* Select character talents and feats */

	// useEffect to load previous selections form localStorage
}

function Root(props) {
	return (
		<div className="container-fluid">
			<h1>Testing</h1>
		</div>
	);
}

ReactDOM.render(<Root />, document.getElementById('react_app'));
