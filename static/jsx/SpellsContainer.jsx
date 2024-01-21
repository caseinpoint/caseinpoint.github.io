"use strict";

const CATEGORIES = ["atk", "atk", "def", "def", "icn", "icn"];

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

function getCategoryArray() {
	/* Get a new, shuffled array of spell categories */

	const categories = [...CATEGORIES];

	for (let n = 0; n < 3; n++) {
		for (let i in categories) {
			const r = Math.floor(Math.random() * categories.length);
			[categories[i], categories[r]] = [categories[r], categories[i]];
		}
	}

	return categories;
}

function getIcon() {
	/* Get a random Icon string from the array */

	const rIdx = Math.floor(Math.random() * ICONS.length);

	return ICONS[rIdx];
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

	// state
	const [categories, setCategories] = React.useState([]);
	const [currentCategory, setCurrentCategory] = React.useState("");
	const [currentIcon, setCurrentIcon] = React.useState("");
	const [atkSpells, setAtkSpells] = React.useState([]);
	const [defSpells, setDefSpells] = React.useState([]);
	const [icnSpells, setIcnSpells] = React.useState([]);
	// const [ncrSpells, setNcrSpells] = React.useState([]);
	// const [wizSpells, setWizSpells] = React.useState([]);
	// const [clrSpells, setClrSpells] = React.useState([]);
	// const [srcSpells, setSrcSpells] = React.useState([]);
	const [weirdness, setWeirdness] = React.useState({});

	function updateCategories(newCategories) {
		/* Update state and save to localStorage */

		setCategories(newCategories);
		localStorage.setItem("categories", JSON.stringify(newCategories));
	}

	function updateCurrentCategory(newCategory) {
		/* Update state and save to localStorage */

		setCurrentCategory(newCategory);
		localStorage.setItem("currentCategory", newCategory);
	}

	function updateCurrentIcon(newIcon) {
		/* Update state and save to localStorage */

		setCurrentIcon(newIcon);
		localStorage.setItem("currentIcon", "newIcon");
	}

	function fetchAllCategories() {
		/* Get spell categories + currents from localStorage or create new ones */

		const categoriesStr = localStorage.getItem("categories");
		const currentCatStr = localStorage.getItem("currentCategory");
		const currentIcnStr = localStorage.getItem("currentIcon");

		if (categoriesStr !== null) {
			setCategories(JSON.parse(categoriesStr));
			setCurrentCategory(currentCatStr);
			setCurrentIcon(currentIcnStr);
		} else {
			const newCategories = getCategoryArray();
			updateCategories(newCategories);
			// currentCategory and currentIcon are already set to ""
		}
	}

	// on load
	React.useEffect(() => {
		fetchAllCategories();

		fetch("/static/json/attack.json")
			.then((response) => response.json())
			.then((atkJSON) => setAtkSpells(atkJSON));

		fetch("/static/json/defense.json")
			.then((response) => response.json())
			.then((defJSON) => setDefSpells(defJSON));

		fetch("/static/json/icon.json")
			.then((response) => response.json())
			.then((icnJSON) => setIcnSpells(icnJSON));

		fetch("/static/json/weirdness.json")
			.then((response) => response.json())
			.then((wrdJSON) => setWeirdness(wrdJSON));

		// TODO: add cleric, necromancer, sorcerer, and wizard spells JSON for
		// those talents
	}, []);

	// render
	return (
		<div
			key="SpellsContainer"
			className="row py-1 border-top border-3 border-primary"
		>
			<h2 className="text-center">Current Spells</h2>
		</div>
	);
}
