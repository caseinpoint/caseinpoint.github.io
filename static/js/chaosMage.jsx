'use strict';

const ICONS = ['Archmage', 'Crusader', 'Diabolist', 'Dwarf King', 'Elf Queen',
	'Great Gold Wyrm', 'High Druid', 'Lich King', 'Orc Lord', 'Priestess',
	'Prince of Shadows', 'The Three'];

function getIcon() {
	/* Get a random Icon string from the array */

	const rIdx = Math.floor(Math.random() * ICONS.length);

	return ICONS[rIdx];
}


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

	// TODO: full heal-up button to reset

	let counters;
	if (props.lvlProgression.idx0) {
		counters = [['perBattle', 'Per Battle'], ['daily', 'Daily']].map((frq) => {
			const [ freq, freqName ] = frq;

			return (
				<div key={freq} className="col-7 col-md-4 col-lg-3 col-xxl-2 mb-1">
					<div className="input-group">
						<input id="daily" className="form-control" type="number" min="0"
							max={props.lvlProgression[freq][props.charLvl]} />
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
		<div className="row justify-content-center py-1 border-top border-3 border-primary">
			<h3 className="text-center">Spell Tracker</h3>

			{counters}

			<div className="col-7 col-md-4 col-lg-3 col-xxl-2 mb-1">
				<button className="btn">Full Heal</button>
			</div>

		</div>
	);
}


function WandW(props) {
	/* React component: Display Warps and High Weirdness */

	// inside of SpellsContainer
}


function SpellDetail(props) {
	/* React component: Display all the details for a spell */

	// inside of SpellsContainer

	// TODO: highlight any selected feats in props.options
}


function SpellsContainer(props) {
	/* React component: Display all SpellDetails that are currently available */
}


function Root(props) {
	/* Root React component */

	// state
	const [options, setOptions] = React.useState({});
	const [categories, setCategories] = React.useState([]);
	const [currentCategory, setCurrentCategory] = React.useState(null);
	const [currentIcon, setCurrentIcon] = React.useState(null);
	const [talents, setTalents] = React.useState({});
	const [weirdness, setWeirdness] = React.useState({});
	const [lvlProgression, setLvlProgression] = React.useState({});
	const [atkSpells, setAtkSpells] = React.useState([]);
	const [defSpells, setDefSpells] = React.useState([]);
	const [icnSpells, setIcnSpells] = React.useState([]);

	function updateOptions(newOptions) {
		/* Update state and save to localStorage */

		setOptions(newOptions)

		const optStr = JSON.stringify(newOptions);
		localStorage.setItem('options', optStr);
	}

	function fetchOptions() {
		/* Get options from localStorage or fetch from /static */

		const optionsStr = localStorage.getItem('options');

		if (optionsStr !== null) {
			const oldOptions = JSON.parse(optionsStr);
			setOptions(oldOptions);
		} else {
			fetch('/static/json/options.json').then((response) => response.json())
				.then((optJSON) => updateOptions(optJSON));
		}
	}

	function updateCategories(newCategories) {
		/* Update state and save to localStorage */

		setCategories(newCategories);

		const categoriesStr = JSON.stringify(newCategories);
		localStorage.setItem('categories', categoriesStr);
	}

	function fetchCategories() {
		/* Get spell categories from localStorage or create new ones */

		const categoriesStr = localStorage.getItem('categories');

		if (categoriesStr !== null) {
			const oldCategories = JSON.parse(categoriesStr);
			setCategories(oldCategories);
		} else {
			const newCategories = getCategoryArray();
			updateCategories(newCategories);
		}
	}

	// on load, set initial categories and get JSON data from /static
	React.useEffect(() => {
		fetchOptions();

		fetchCategories();

		fetch('/static/json/talents.json').then((response) => response.json())
			.then((tltJSON) => setTalents(tltJSON));

		fetch('/static/json/weirdness.json').then((response) => response.json())
			.then((wrdJSON) => setWeirdness(wrdJSON));

		fetch('/static/json/lvlProg.json').then((response) => response.json())
			.then((lvlJSON) => setLvlProgression(lvlJSON));

		fetch('/static/json/attack.json').then((response) => response.json())
			.then((atkJSON) => setAtkSpells(atkJSON));
		
		fetch('/static/json/defense.json').then((response) => response.json())
			.then((defJSON) => setDefSpells(defJSON));

		fetch('/static/json/icon.json').then((response) => response.json())
			.then((icnJSON) => setIcnSpells(icnJSON));

		// TODO: add cleric, necromancer, sorcerer, and wizard spells JSON for
		// those talents

	}, []);


	// render
	return (
		<div className="container-fluid">
			<h2 className="text-center">Chaos Mage Spell App</h2>

			<OptionsMenu options={options} updateOptions={updateOptions}
				talents={talents} weirdness={weirdness} />

			<SpellsTracker lvlProgression={lvlProgression}
				charLvl={options.charLvl} />
		</div>
	);
}


ReactDOM.render(<Root />, document.getElementById('react_app'));
