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


function OptionsMenu(props) {
	/* React component: Select character talents and feats */

	const [ charLvl, setCharLvl ] = React.useState(1);

	// TODO: useEffect to load previous selections form localStorage

	function handleLvlSelect(evt) {
		// TODO: update Root options
		// TODO: save to localStorage
		setCharLvl(Number(evt.target.value));
	}

	const levels = ['1 Multiclass', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const levelOpts = levels.map((lvl, idx) =>
		<option key={`charLvl${idx}`} value={idx}>Level {lvl}</option>
	);

	let warpTalents;
	if (props.talents.warpTalents) {
		warpTalents = Object.entries(props.talents.warpTalents)
			.map((item, idx) => {
				const [ key, talent ] = item;
				return (
					<div key={`warpTal${idx}`} className="form-check form-switch">
						<input id={`warpTal${idx}`} className="form-check-input"
							type="checkbox" value={key} />
						<label for={`warpTal${idx}`} className="form-check-label">
							{talent.name}
						</label>
					</div>
				);
		});
	}

	let casterTalents;
	if (props.talents.casterTalents) {
		casterTalents = Object.entries(props.talents.casterTalents)
			.map((item, idx) => {
				const [ key, talent ] = item;
				return (
					<div key={`casterTal${idx}`} className="form-check form-switch">
						<input id={`casterTal${idx}`} className="form-check-input"
							type="checkbox" value={key} />
						<label for={`casterTal${idx}`} className="form-check-label">
							{talent.name}
						</label>
					</div>
				);
		});
	}

	let spellFeats;
	if (props.talents.spellFeats) {
		spellFeats = props.talents.spellFeats.map((feat, idx) => {
			return (
				<div key={`spellFeat${idx}`}>
					<p className="mt-1 mb-0">{feat}</p>
					<div className="form-check form-check-inline form-switch">
						<input id={`spellFeat${idx}_adv`} className="form-check-input"
							type="checkbox" value={`${feat}_adv`} />
						<label for={`spellFeat${idx}_adv`} className="form-check-label">
							Adventurer
						</label>
					</div>
					<div className="form-check form-check-inline form-switch">
						<input id={`spellFeat${idx}_chmp`} className="form-check-input"
							type="checkbox" value={`${feat}_chmp`} />
						<label for={`spellFeat${idx}_chmp`} className="form-check-label">
							Champion
						</label>
					</div>
					<div className="form-check form-check-inline form-switch">
						<input id={`spellFeat${idx}_epic`} className="form-check-input"
							type="checkbox" value={`${feat}_epic`} />
						<label for={`spellFeat${idx}_epic`} className="form-check-label">
							Epic
						</label>
					</div>
				</div>
			);
		});
	}

	// render
	return (
		<div className="row py-1 border-top border-3">
			<h3 className="text-center">Character Options</h3>

			<div className="col-12 col-md-6 col-xl-3 py-1 border rounded">
				<h4 className="text-center">Character Level</h4>
				<select className="form-control" value={charLvl}
					onChange={handleLvlSelect}>
					{levelOpts}
				</select>
			</div>

			<div className="col-12 col-md-6 col-xl-3 py-1 border rounded">
				<h4 className="text-center">Warp Talents</h4>
				{warpTalents}
			</div>

			<div className="col-12 col-md-6 col-xl-3 py-1 border rounded">
				<h4 className="text-center">Spellcaster Class Talents</h4>
				{casterTalents}
			</div>

			<div className="col-12 col-md-6 col-xl-3 py-1 border rounded">
				<h4 className="text-center">Spell Feats</h4>
				{spellFeats}
			</div>
		</div>
	);
}


function WandW(props) {
	/* React component: Display Warps and High Weirdness */
}


function SpellsTracker(props) {
	/* React compmponent: Track daily/per battle spells for character level */

	// TODO: useEffect to load most recent values from localStorage
	// TODO: full heal-up button to reset
}


function SpellDetail(props) {
	/* React component: Display all the details for a spell */
}


function SpellsContainer(props) {
	/* React component: Display all SpellDetails that are currently available */
}


function Root(props) {
	/* Root React component */

	// state
	const [categories, setCategories] = React.useState([]);
	const [options, setOptions] = React.useState({});
	const [talents, setTalents] = React.useState({});
	const [weirdness, setWeirdness] = React.useState({});
	const [lvlProg, setLvlProg] = React.useState({});
	const [atkSpells, setAtkSpells] = React.useState([]);
	const [defSpells, setDefSpells] = React.useState([]);
	const [icnSpells, setIcnSpells] = React.useState([]);

	// on load, set initial categories and get JSON data from /static
	React.useEffect(() => {
		setCategories(getCategoryArray());

		fetch('/static/json/options.json').then((response) => response.json())
			.then((optJSON) => setOptions(optJSON));

		fetch('/static/json/talents.json').then((response) => response.json())
			.then((tltJSON) => setTalents(tltJSON));

		fetch('/static/json/weirdness.json').then((response) => response.json())
			.then((wrdJSON) => setWeirdness(wrdJSON));

		fetch('/static/json/lvlProg.json').then((response) => response.json())
			.then((lvlJSON) => setLvlProg(lvlJSON));

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

			<OptionsMenu talents={talents} weirdness={weirdness} />
		</div>
	);
}


ReactDOM.render(<Root />, document.getElementById('react_app'));
