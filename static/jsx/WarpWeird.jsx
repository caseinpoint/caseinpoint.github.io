"use strict";

function WarpWeird(props) {
	/* React component: Display current Warp and/or high weirdness */

	// state
	const [weirdness, setWeirdness] = React.useState({});
	const [currentWeird, setCurrentWeird] = React.useState(null);
	const [currentWarp, setCurrentWarp] = React.useState(null);

	// on load
	React.useEffect(() => {
		fetch('/static/json/weirdness.json')
			.then((response) => response.json())
			.then((weirdJSON) => setWeirdness(weirdJSON));
	}, []);

	return (
		<div className="row mt-1 py-2 border-top border-info border-2"></div>
	);
}