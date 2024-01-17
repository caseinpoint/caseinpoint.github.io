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

	const levels = ['1 Multiclass', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const levelOpts = levels.map((lvl, idx) =>
		<option key={`charLvl${idx}`} value={idx}>Level {lvl}</option>
	);

	function handleLvlSelect(evt) {
		setCharLvl(Number(evt.target.value));
	}

	// render
	return (
		<div className="row border-top border-bottom border-3">
			<h3 className="text-center">Character Options</h3>

			<div className="col-12 col-lg-4 border border-bottom-0 rounded">
				<h4 className="text-center">Character Level</h4>
				<select className="form-control my-1" value={charLvl} onChange={handleLvlSelect}>
					{levelOpts}
				</select>
			</div>

			<div className="col-12 col-lg-4 border border-bottom-0 rounded">
				<h4 className="text-center">Warp Talents</h4>
			</div>

			<div className="col-12 col-lg-4 border border-bottom-0 rounded">
				<h4 className="text-center">Spellcaster Class Talents</h4>
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
	// state from JSON
	const [lvlProg, setLvlProg] = React.useState({});
	const [talents, setTalents] = React.useState({});
	const [weirdness, setWeirdness] = React.useState({});
	const [atkSpells, setAtkSpells] = React.useState([]);
	const [defSpells, setDefSpells] = React.useState([]);
	const [icnSpells, setIcnSpells] = React.useState([]);

	// on load, set initial categories and get JSON data from /static
	React.useEffect(() => {
		setCategories(getCategoryArray());

		fetch('/static/json/lvlProg.json').then((response) => response.json())
			.then((lvlJSON) => setLvlProg(lvlJSON));

		fetch('/static/json/talents.json').then((response) => response.json())
			.then((tltJSON) => setTalents(tltJSON));

		fetch('/static/json/weirdness.json').then((response) => response.json())
			.then((wrdJSON) => setWeirdness(wrdJSON));

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

			<OptionsMenu warps={talents} weirdness={weirdness} />
		</div>
	);
}


ReactDOM.render(<Root />, document.getElementById('react_app'));

// options = {
// 	charLvl: 1,
// 	talents: {
// 		warps: {
// 			atk: {
// 				hasTalent: false,
// 				feats: {
// 					adv: false,
// 					chmp: false,
// 					epic: false
// 				}
// 			},
// 			def: {
// 				hasTalent: false,
// 				feats: {
// 					adv: false,
// 					chmp: false,
// 					epic: false
// 				}
// 			},
// 			icn: {
// 				hasTalent: false,
// 				feats: {
// 					adv: false,
// 					chmp: false,
// 					epic: false
// 				}
// 			},
// 		},
// 		casters: {
// 			necromancer: {
// 				hasTalent: false,
// 				feats: {
// 					adv: false,
// 					chmp: false,
// 					epic: false
// 				}
// 			},
// 			wizard: {
// 				hasTalent: false,
// 				feats: {
// 					adv: false,
// 					chmp: false,
// 					epic: false
// 				}
// 			},
// 			cleric: {
// 				hasTalent: false,
// 				feats: {
// 					adv: false,
// 					chmp: false,
// 					epic: false
// 				}
// 			},
// 			sorcerer: {
// 				hasTalent: false,
// 				feats: {
// 					adv: false,
// 					chmp: false,
// 					epic: false
// 				}
// 			}
// 		}
// 	},
// 	feats: {

// 	}
// }