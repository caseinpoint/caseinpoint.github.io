'use strict';

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

	// state
	const [categories, setCategories] = React.useState([]);
	const [options, setOptions] = React.useState({});
	// state from JSON
	const [lvlProg, setLvlProg] = React.useState({});
	const [warps, setWarps] = React.useState({});
	const [weirdness, setWeirdness] = React.useState({});
	const [atkSpells, setAtkSpells] = React.useState([]);
	const [defSpells, setDefSpells] = React.useState([]);
	const [icnSpells, setIcnSpells] = React.useState([]);

	// on load
	React.useEffect(() => {
		setCategories(getCategoryArray());

		fetch('/static/json/lvlProg.json').then((response) => response.json())
			.then((lvlJSON) => setLvlProg(lvlJSON));

		fetch('/static/json/warps.json').then((response) => response.json())
			.then((wrpJSON) => setWarps(wrpJSON));

		fetch('/static/json/weirdness.json').then((response) => response.json())
			.then((wrdJSON) => setWeirdness(wrdJSON));

		fetch('/static/json/attack.json').then((response) => response.json())
			.then((atkJSON) => setAtkSpells(atkJSON));
		
		fetch('/static/json/defense.json').then((response) => response.json())
			.then((defJSON) => setDefSpells(defJSON));

		fetch('/static/json/icon.json').then((response) => response.json())
			.then((icnJSON) => setIcnSpells(icnJSON));

	}, []);

	return (
		<div className="container-fluid">
			<h2 className="text-center">Chaos Mage Spell App</h2>
		</div>
	);
}

ReactDOM.render(<Root />, document.getElementById('react_app'));
