"use strict";

function Root(props) {
	/* Root React component */

	// state
	const [options, setOptions] = React.useState({});
	const [talents, setTalents] = React.useState({});

	function updateOptions(newOptions) {
		/* Update state and save to localStorage */

		setOptions(newOptions);

		const optStr = JSON.stringify(newOptions);
		localStorage.setItem("options", optStr);
	}

	function fetchOptions() {
		/* Get options from localStorage or fetch from /static */

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

		fetch("/static/json/talents.json")
			.then((response) => response.json())
			.then((tltJSON) => setTalents(tltJSON));
	}, []);

	// render
	return (
		<div key="Root" className="container-fluid">
			<h2 className="text-center">Chaos Mage Spell App</h2>

			<OptionsMenu
				options={options}
				updateOptions={updateOptions}
				talents={talents}
			/>

			<SpellsTracker charLvl={options.charLvl} />

			<SpellsContainer options={options} talents={talents} />
		</div>
	);
}

ReactDOM.render(<Root />, document.getElementById("react_app"));
