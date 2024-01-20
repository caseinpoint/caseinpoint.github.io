"use strict";

function SpellsTracker(props) {
	/* React compmponent: Track daily/per battle spells for character level */

	// state
	const [spellCounts, setSpellCounts] = React.useState({
		perBattle: 0,
		daily: 0,
	});
	const [lvlProgression, setLvlProgression] = React.useState({});

	// onload
	React.useEffect(() => {
		// retrieve daily & perBattle from localStorage and add to state
		const spellCountsStr = localStorage.getItem("spellCounts");
		if (spellCountsStr !== null) {
			setSpellCounts(JSON.parse(spellCountsStr));
		}

		// get level progression JSON from /static
		fetch("/static/json/lvlProg.json")
			.then((response) => response.json())
			.then((lvlJSON) => setLvlProgression(lvlJSON));
	}, []);

	function handleCounter(evt) {
		const freq = evt.target.dataset.freq;
		const count = Number(evt.target.value);

		const newCounts = { ...spellCounts };
		newCounts[freq] = count;

		setSpellCounts(newCounts);
		localStorage.setItem("spellCounts", JSON.stringify(newCounts));
	}

	function handleFullHeal(evt) {
		// TODO: reset spell counts
		// TODO: pick spellcaster talent spells if applicable
		// NOTE: this may need to be implemented in Root and passed in props
	}

	let counters;
	if (lvlProgression.idx0) {
		counters = [
			["perBattle", "Per Battle"],
			["daily", "Daily"],
		].map((itm) => {
			const [freq, freqName] = itm;

			return (
				<div key={freq} className="col-7 col-md-4 col-lg-3 col-xxl-2 mb-1">
					<div className="input-group">
						<input
							id="daily"
							className="form-control"
							type="number"
							min="0"
							max={lvlProgression[freq][props.charLvl]}
							step="1"
							value={spellCounts[freq]}
							data-freq={freq}
							onChange={handleCounter}
						/>
						<span className="input-group-text">
							/ {lvlProgression[freq][props.charLvl]} {freqName}
						</span>
					</div>
				</div>
			);
		});
	}

	// render
	return (
		<div
			key="SpellsTracker"
			className="row justify-content-center py-1 border-top border-3 border-primary"
		>
			<h3 className="text-center">Spell Tracker</h3>

			{counters}

			<div className="col-7 col-md-4 col-lg-3 col-xxl-2 mb-1 d-grid">
				<button className="btn btn-outline-success" onClick={handleFullHeal}>
					Full Heal-Up
				</button>
			</div>
		</div>
	);
}
