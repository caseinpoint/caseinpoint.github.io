"use strict";

function WarpWeird(props) {
	/* React component: Display current Warp and/or high weirdness */

	// state
	const [weirdness, setWeirdness] = React.useState({});
	const [currentWeird, setCurrentWeird] = React.useState(null);
	const [currentWarp, setCurrentWarp] = React.useState(null);

	function updateCurrentWeird(newWeird) {
		/* Update current weirdness state string and save to localStorage */

		setCurrentWeird(newWeird);

		const weirdStr = newWeird === null ? "null" : newWeird
		localStorage.setItem("currentWeird", weirdStr);
	}

	function updateCurrentWarp(newWarp) {
		/* Update current warp state string and save to localStorage */

		setCurrentWarp(newWarp);

		const warpStr = newWarp === null ? "null" : newWarp
		localStorage.setItem("currentWarp", warpStr);
	}

	function fetchCurrentWarpWeird() {
		/* Get previous warp and weirdness from localStorage */

		const weirdStr = localStorage.getItem("currentWeird");
		if (weirdStr !== null && weirdStr !== "null") {
			setCurrentWeird(weirdStr);
		} // else initial value is already null

		const warpStr = localStorage.getItem("currentWarp");
		if (warpStr !== null && warpStr !== "null") {
			setCurrentWarp(warpStr);
		} // else initial value is already null
	}

	// on load
	React.useEffect(() => {
		fetch("/static/json/weirdness.json")
			.then((response) => response.json())
			.then((weirdJSON) => setWeirdness(weirdJSON));
		// Warp talents come in as props

		fetchCurrentWarpWeird();
	}, []);

	function handleRollWeirdness() {
		const newWeird = getRandElement(weirdness.table);
		updateCurrentWeird(newWeird);
	}

	function handleRollTwice() {
		const newWeird1 = getRandElement(weirdness.table);

		let newWeird2 = getRandElement(weirdness.table);
		while (newWeird2 === newWeird1) {
			newWeird2 = getRandElement(weirdness.table);
		}

		const newWeird = `${newWeird1}\n\n${newWeird2}`;
		updateCurrentWeird(newWeird);
	}

	function handleClearWeirdness() {
		updateCurrentWeird(null);
	}

	const currentWarpStr = currentWarp === null ? "none" : currentWarp;
	const currentWeirdStr = currentWeird === null ? "none" : currentWeird;

	let weirdFeats = null;
	if (weirdness.feats) {
		const tiers = [];
		for (let [tier, tierName] of FEAT_TIERS) {
			const featHLight = props.weirdOptions[tier] ? HIGHLIGHT_CLASS : "";

			tiers.push(
				<li key={`weirdFeats_${tier}`}>
					<span className="fw-semibold">{tierName}:</span>{" "}
					<span className={featHLight}>{weirdness.feats[tier]}</span>
				</li>
			);
		}

		weirdFeats = (
			<p className="my-1">
				<span className="fw-bold">Feats:</span>
				<ul>{tiers}</ul>
			</p>
		);
	}

	return (
		<div
			className="row mt-2 py-2 border-top border-info border-2"
			style={{ whiteSpace: "pre-wrap" }}
		>
			<div className="col-12 col-lg-6 py-1 rounded border">
				<h3 className="text-center">Warp Talents</h3>

				<p>
					<b>Current Warp:</b> {currentWarpStr}
				</p>
			</div>

			<div className="col-12 col-lg-6 py-1 rounded border">
				<h3 className="text-center">High Weirdness</h3>

				<div className="d-flex justify-content-evenly mb-1">
					<button
						type="button"
						className="btn btn-outline-info"
						onClick={handleRollWeirdness}
					>
						Roll High Weirdness!
					</button>

					<button
						type="button"
						className="btn btn-outline-danger"
						onClick={handleRollTwice}
					>
						Roll Twice‼
					</button>

					<button
						type="button"
						className="btn btn-outline-secondary"
						onClick={handleClearWeirdness}
					>
						Clear High Weirdness
					</button>
				</div>

				<p className="my-1">
					<b>Current Weirdness:</b> {currentWeirdStr}
				</p>

				{weirdFeats}
			</div>
		</div>
	);
}
