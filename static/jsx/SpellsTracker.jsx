"use strict";

function SpellsTracker(props) {
	/* React compmponent: Track daily/per battle spells for character level */

	// state
	const [spellCounts, setSpellCounts] = React.useState({
		perBattle: 0,
		daily: 0,
	});

	// onload
	React.useEffect(() => {
		// retrieve daily & perBattle from localStorage and add to state
		const spellCountsStr = localStorage.getItem("spellCounts");
		if (spellCountsStr !== null) {
			setSpellCounts(JSON.parse(spellCountsStr));
		}
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
		const newCounts = {
			perBattle: props.lvlProgression.perBattle[props.charLvl],
			daily: props.lvlProgression.daily[props.charLvl],
		};

		setSpellCounts(newCounts);
		localStorage.setItem("spellCounts", JSON.stringify(newCounts));

		props.updateFullHeal();
	}

	// handle endCombat
	React.useEffect(() => {
		if (props.endCombat === true) {
			handleCounter({
				target: {
					dataset: { freq: 'perBattle'},
					value: props.lvlProgression.perBattle[props.charLvl]
				}
			});
		}
	}, [props.endCombat])

	let counters = null;
	if (props.lvlProgression.idx0) {
		counters = [
			["perBattle", "Per Battle"],
			["daily", "Daily"],
		].map((item) => {
			const [freq, freqName] = item;

			return (
				<div key={freq} className="col-7 col-md-4 col-lg-3 col-xxl-2 mb-1">
					<div className="input-group">
						<input
							id="daily"
							className="form-control"
							type="number"
							min="0"
							max={props.lvlProgression[freq][props.charLvl]}
							step="1"
							value={spellCounts[freq]}
							data-freq={freq}
							onChange={handleCounter}
						/>
						<span className="input-group-text">
							/ {props.lvlProgression[freq][props.charLvl]} {freqName}
						</span>
					</div>
				</div>
			);
		});
	}

	// render
	return (
		<section
			key="SpellsTracker"
			className="row justify-content-center py-1 border-top border-4 border-primary"
		>
			<h3 className="text-center">Spells Tracker</h3>

			{counters}

			<div className="col-7 col-md-4 col-lg-3 col-xxl-2 mb-1 d-grid">
				<button className="btn btn-outline-success" onClick={handleFullHeal}>
					Full Heal-Up
				</button>
			</div>
		</section>
	);
}
