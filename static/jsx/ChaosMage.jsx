"use strict";

function ChaosMage(props) {
	/* Root React component */

	// state
	const [options, setOptions] = React.useState({});
	const [talents, setTalents] = React.useState({});
	const [lvlProgression, setLvlProgression] = React.useState({});

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
			fetch("/static/json/options.json")
				.then((response) => response.json())
				.then((optJSON) => updateOptions(optJSON));
		}
	}

	// on load
	React.useEffect(() => {
		fetchOptions();

		fetch("/static/json/lvlProg.json")
			.then((response) => response.json())
			.then((lvlJSON) => setLvlProgression(lvlJSON));

		fetch("/static/json/talents.json")
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
				talents={talents}
			/>

			<SpellsTracker
				charLvl={options.charLvl}
				lvlProgression={lvlProgression}
			/>

			<SpellsContainer
				options={options}
				lvlProgression={lvlProgression}
				talents={talents}
			/>
		</div>
	);
}

ReactDOM.render(<ChaosMage />, document.getElementById("react_app"));
