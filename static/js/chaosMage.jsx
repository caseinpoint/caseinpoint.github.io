"use strict";

const ICONS = [
	"Archmage",
	"Crusader",
	"Diabolist",
	"Dwarf King",
	"Elf Queen",
	"Great Gold Wyrm",
	"High Druid",
	"Lich King",
	"Orc Lord",
	"Priestess",
	"Prince of Shadows",
	"The Three",
];

function getIcon() {
	/* Get a random Icon string from the array */

	const rIdx = Math.floor(Math.random() * ICONS.length);

	return ICONS[rIdx];
}

function getCategoryArray() {
	/* Get a new, shuffled array of spell categories */

	const categories = ["atk", "atk", "def", "def", "icn", "icn"];

	for (let n = 0; n < 3; n++) {
		for (let i in categories) {
			const r = Math.floor(Math.random() * categories.length);
			[categories[i], categories[r]] = [categories[r], categories[i]];
		}
	}

	return categories;
}

function WandW(props) {
	/* React component: Display Warps and High Weirdness */
	// TODO: inside of SpellsContainer, bottom
}

function SpellDetail(props) {
	/* React component: Display all the details for a spell */
	// TODO: inside of SpellsContainer
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
	const [currentCategory, setCurrentCategory] = React.useState("");
	const [currentIcon, setCurrentIcon] = React.useState("");
	const [talents, setTalents] = React.useState({});
	const [weirdness, setWeirdness] = React.useState({});
	const [lvlProgression, setLvlProgression] = React.useState({});
	const [atkSpells, setAtkSpells] = React.useState([]);
	const [defSpells, setDefSpells] = React.useState([]);
	const [icnSpells, setIcnSpells] = React.useState([]);

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

	function updateCategories(newCategories) {
		/* Update state and save to localStorage */

		setCategories(newCategories);
		localStorage.setItem("categories", JSON.stringify(newCategories));
	}

	function fetchCategories() {
		/* Get spell categories from localStorage or create new ones */

		const categoriesStr = localStorage.getItem("categories");

		if (categoriesStr !== null) {
			setCategories(JSON.parse(categoriesStr));
		} else {
			const newCategories = getCategoryArray();
			updateCategories(newCategories);
		}
	}

	// on load, set initial categories and get JSON data from /static
	React.useEffect(() => {
		fetchOptions();

		fetchCategories();

		fetch("/static/json/talents.json")
			.then((response) => response.json())
			.then((tltJSON) => setTalents(tltJSON));

		fetch("/static/json/weirdness.json")
			.then((response) => response.json())
			.then((wrdJSON) => setWeirdness(wrdJSON));

		fetch("/static/json/lvlProg.json")
			.then((response) => response.json())
			.then((lvlJSON) => setLvlProgression(lvlJSON));

		fetch("/static/json/attack.json")
			.then((response) => response.json())
			.then((atkJSON) => setAtkSpells(atkJSON));

		fetch("/static/json/defense.json")
			.then((response) => response.json())
			.then((defJSON) => setDefSpells(defJSON));

		fetch("/static/json/icon.json")
			.then((response) => response.json())
			.then((icnJSON) => setIcnSpells(icnJSON));

		// TODO: add cleric, necromancer, sorcerer, and wizard spells JSON for
		// those talents
	}, []);

	// render
	return (
		<div key="Root" className="container-fluid">
			<h2 className="text-center">Chaos Mage Spell App</h2>

			<OptionsMenu
				options={options}
				updateOptions={updateOptions}
				talents={talents}
				weirdness={weirdness}
			/>

			<SpellsTracker
				lvlProgression={lvlProgression}
				charLvl={options.charLvl}
			/>
		</div>
	);
}

ReactDOM.render(<Root />, document.getElementById("react_app"));
