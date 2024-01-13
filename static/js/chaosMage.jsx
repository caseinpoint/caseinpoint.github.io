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
	const [options, setOptions] = React.useState({});
	const [categories, setCategories] = React.useState([]);

	// on load
	React.useEffect(() => {
		setCategories(getCategoryArray());
	}, []);

	return (
		<div className="container-fluid">
			<h1>Chaos Mage Spell App</h1>
		</div>
	);
}

(async function main() {
	const lvlRes = await fetch('/static/json/levelProgression.json');
	const lvlJSON = await lvlRes.json();

	const wrpRes = await fetch('/static/json/warps.json');
	const wrpJSON = await wrpRes.json();

	const wrdRes = await fetch('/static/json/weirdness.json');
	const wrdJSON = await wrdRes.json();

	const atkRes = await fetch('/static/json/attack.json');
	const atkJSON = await atkRes.json();
		
	const defRes = await fetch('/static/json/defense.json');
	const defJSON = await defRes.json();

	const icnRes = await fetch('/static/json/icon.json');
	const icnJSON = await icnRes.json();

	ReactDOM.render(
		<Root levels={lvlJSON} warps={wrpJSON} weirdness={wrdJSON}
			atkSpells={atkJSON} defSpells={defJSON} icnSpells={icnJSON} />,
		document.getElementById('react_app'));
})(); 
