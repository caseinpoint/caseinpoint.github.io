"use strict";

function ChaosMage(props) {
	/* Root React component */

	// state
	const [options, setOptions] = React.useState({});
	const [talents, setTalents] = React.useState({});
	const [lvlProgression, setLvlProgression] = React.useState({});
	const [fullHeal, setFullHeal] = React.useState(false);
	const [endCombat, setEndCombat] = React.useState(false);
	const [addSpells, setAddSpells] = React.useState([]);

	function updateOptions(newOptions) {
		/* Update state and save to localStorage */

		setOptions(newOptions);

		const optStr = JSON.stringify(newOptions);
		localStorage.setItem("options", optStr);
	}

	function fetchOptions() {
		/* Get options from localStorage or fetch default from /static */

		const optionsStr = localStorage.getItem("options");

		if (optionsStr !== null) {
			setOptions(JSON.parse(optionsStr));
		} else {
			fetch("/chaosmage/static/json/options.json")
				.then((response) => response.json())
				.then((optJSON) => updateOptions(optJSON));
		}
	}

	function updateFullHeal() {
		/* Temporarily set fullHeal to true */

		setFullHeal(() => {
			setTimeout(() => setFullHeal(false), 1000);
			return true;
		})
	}

	function updateEndCombat() {
		/* Temporarily set endCombat to true */

		setEndCombat(() => {
			setTimeout(() => setEndCombat(false), 1000);
			return true;
		})
	}

	// on load
	React.useEffect(() => {
		fetchOptions();

		fetch("/chaosmage/static/json/lvlProg.json")
			.then((response) => response.json())
			.then((lvlJSON) => setLvlProgression(lvlJSON));

		fetch("/chaosmage/static/json/talents.json")
			.then((response) => response.json())
			.then((tltJSON) => setTalents(tltJSON));
	}, []);

	// render
	return (
		<div key="ChaosMage" className="container-fluid">
			<h1 className="text-center">Chaos Mage Spell App</h1>

			<OptionsMenu
				options={options}
				updateOptions={updateOptions}
				lvlProgression={lvlProgression}
				talents={talents}
				addSpells={addSpells}
			/>

			<SpellsTracker
				charLvl={options.charLvl}
				lvlProgression={lvlProgression}
				updateFullHeal={updateFullHeal}
				endCombat={endCombat}
			/>

			<SpellsContainer
				options={options}
				lvlProgression={lvlProgression}
				talents={talents}
				fullHeal={fullHeal}
				updateEndCombat={updateEndCombat}
				addSpells={addSpells}
				setAddSpells={setAddSpells}
			/>
		</div>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<ChaosMage />
	</React.StrictMode>,
	document.getElementById("react_app")
);
