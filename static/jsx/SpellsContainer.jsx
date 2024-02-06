"use strict";

const CATEGORIES = ["atk", "atk", "def", "def", "icn", "icn"];
const CAT_NAMES = { atk: "Attack", def: "Defense", icn: "Icon", null: "none" };

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

function getRandElement(arr) {
	/* Get a random element from array */

	const rIdx = Math.floor(Math.random() * arr.length);

	return arr[rIdx];
}

function WandW(props) {
	/* React component: Display Warps and High Weirdness */
	// TODO: inside of SpellsContainer, bottom
}

function SpellsContainer(props) {
	/* React component: Display all SpellDetails that are currently available */

	// state
	const [categories, setCategories] = React.useState([]);
	const [currentCategory, setCurrentCategory] = React.useState(null);
	const [currentIcon, setCurrentIcon] = React.useState(null);
	const [randBtn, setRandBtn] = React.useState(randomRGBA(0.25, 0.5));
	const [randULine, setRandULine] = React.useState(randomRGBA(0, 0));
	const [atkSpells, setAtkSpells] = React.useState([]);
	const [defSpells, setDefSpells] = React.useState([]);
	const [icnSpells, setIcnSpells] = React.useState([]);
	const [ncrSpells, setNcrSpells] = React.useState({});
	const [wizSpells, setWizSpells] = React.useState({});
	const [clrSpells, setClrSpells] = React.useState({});
	const [srcSpells, setSrcSpells] = React.useState({});
	const [addSpells, setAddSpells] = React.useState([]);
	const [weirdness, setWeirdness] = React.useState({});

	function updateCategories(newCategories) {
		/* Update categories state and save to localStorage */

		setCategories(newCategories);
		localStorage.setItem("categories", JSON.stringify(newCategories));
	}

	function updateCurrentCategory(newCategory) {
		/* Update currentCategory state and save to localStorage */

		setCurrentCategory(newCategory);
		localStorage.setItem("currentCategory", JSON.stringify(newCategory));
	}

	function updateCurrentIcon(newIcon) {
		/* Update currentIcon state and save to localStorage */

		setCurrentIcon(newIcon);
		localStorage.setItem("currentIcon", JSON.stringify(newIcon));
	}

	function fetchAllCategories() {
		/* Get spell categories + currents from localStorage or create new ones */

		const categoriesStr = localStorage.getItem("categories");
		const currentCatStr = localStorage.getItem("currentCategory");
		const currentIcnStr = localStorage.getItem("currentIcon");

		if (categoriesStr !== null) {
			setCategories(JSON.parse(categoriesStr));
			setCurrentCategory(JSON.parse(currentCatStr));
			setCurrentIcon(JSON.parse(currentIcnStr));
		} else {
			updateCategories(getCategoryArray());
			// NOTE: currentCategory and currentIcon are already initialized to null
		}
	}

	function resetAddSpells() {
		/* Reset additional spells from spellcaster class talents */

		const castLvl = props.lvlProgression.spellLvl[props.options.charLvl];

		const newAddSpells = []

		if (props.options.casterTalents.necromancer.hasTalent) {
			newAddSpells.push(getRandElement(ncrSpells[castLvl]))
		}

		if (props.options.casterTalents.wizard.hasTalent) {
			newAddSpells.push(getRandElement(wizSpells[castLvl]))
		}

		if (props.options.casterTalents.cleric.hasTalent) {
			newAddSpells.push(getRandElement(clrSpells[castLvl]))
		}

		if (props.options.casterTalents.sorcerer.hasTalent) {
			newAddSpells.push(getRandElement(srcSpells[castLvl]))
		}

		setAddSpells(newAddSpells);
		localStorage.setItem("addSpells", JSON.stringify(newAddSpells));
	}

	function fetchAddSpells() {
		/* Get additional spells for spellcaster class talents from localStorage */

		const addSpellsStr = localStorage.getItem("addSpells");
		if (addSpellsStr !== null) {
			setAddSpells(JSON.parse(addSpellsStr));
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

		fetch("/static/json/cleric.json")
			.then((response) => response.json())
			.then((clrJSON) => setClrSpells(clrJSON));

		fetch("/static/json/necromancer.json")
			.then((response) => response.json())
			.then((ncrJSON) => setNcrSpells(ncrJSON));

		fetch("/static/json/sorcerer.json")
			.then((response) => response.json())
			.then((srcJSON) => setSrcSpells(srcJSON));

		fetch("/static/json/wizard.json")
			.then((response) => response.json())
			.then((wizJSON) => setWizSpells(wizJSON));

		fetchAddSpells();
	}, []);

	// animate Next Spell Category button
	React.useEffect(() => {
		let timeoutID;

		(function recursiveDelay() {
			// random delay between 1 and 6 seconds
			const delay = 1000 + Math.floor(Math.random() * 5001);

			timeoutID = setTimeout(() => {
				setRandBtn(randomRGBA(0.3, 0.7));
				recursiveDelay();
			}, delay);
		})();

		return () => clearTimeout(timeoutID);
	}, []);

	function handleNextCategory() {
		const newCategories =
			categories.length > 1 ? [...categories] : getCategoryArray();
		const newCategory = newCategories.pop();
		const newIcon = newCategory === "icn" ? getRandElement(ICONS) : null;

		updateCategories(newCategories);
		updateCurrentCategory(newCategory);
		updateCurrentIcon(newIcon);
		setRandULine(randomRGBA(0.95, 1.0));
	}

	function handleResetCategories() {
		updateCategories(getCategoryArray());
		updateCurrentCategory(null);
		updateCurrentIcon(null);
		setRandULine(randomRGBA(0, 0));
		props.updateEndCombat();
	}

	// handle Full Heal-Up
	React.useEffect(() => {
		if (props.fullHeal === true) {
			handleResetCategories();
			resetAddSpells();
		}
	}, [props.fullHeal])

	let iconP = null;
	if (currentIcon !== null && icnSpells[currentIcon]) {
		iconP = (
			<p className="text-center h5">
				Current Icon:{" "}
				<span
					style={{
						textDecorationLine: "underline",
						textDecorationThickness: "0.2em",
						textDecorationColor: randULine,
					}}
				>
					{currentIcon} ({icnSpells[currentIcon].feat})
				</span>
			</p>
		);
	}

	let spells = [];
	const atkDefMap = (spell, idx) => {
		return (
			<SpellDetail
				key={`spell${idx}`}
				options={props.options}
				lvlProgression={props.lvlProgression}
				spellType={currentCategory}
				spell={spell}
				feat={null}
			/>
		);
	};

	if (currentCategory === "atk") {
		spells = atkSpells.map(atkDefMap);
	} else if (currentCategory === "def") {
		spells = defSpells.map(atkDefMap);
	} else if (currentCategory === "icn" && icnSpells[currentIcon]) {
		spells = icnSpells[currentIcon].spells.map((spell, idx) => {
			return (
				<SpellDetail
					key={`spell${idx}`}
					options={props.options}
					lvlProgression={props.lvlProgression}
					spellType={currentCategory}
					spell={spell}
					feat={icnSpells[currentIcon].feat}
				/>
			);
		});
	}

	// push additional spells
	for (let spell of addSpells) {
		if (spell.category === currentCategory) {
			spells.push(atkDefMap(spell, spell.title));
		}
	}

	// render
	return (
		<section
			key="SpellsContainer"
			className="row justify-content-center py-1 border-top border-4 border-primary"
		>
			<h2 className="text-center">Current Spells</h2>

			<div className="col-7 col-md-3 col-lg-4 text-center mb-1">
				<button
					className="btn btn-lg btn-outline-light my-auto"
					style={{ backgroundColor: randBtn }}
					onClick={handleNextCategory}
				>
					Next Category
				</button>
			</div>

			<div className="col-9 col-md-6 col-lg-4 mb-1">
				<p className="text-center h5">
					Current Category:&ensp;
					<span
						style={{
							textDecorationLine: "underline",
							textDecorationThickness: "0.2em",
							textDecorationColor: randULine,
						}}
					>
						{CAT_NAMES[currentCategory]}
					</span>
				</p>
				{iconP}
			</div>

			<div className="col-7 col-md-3 col-lg-4 text-center mb-1">
				<button
					className="btn btn-outline-light my-auto"
					onClick={handleResetCategories}
				>
					End Combat
				</button>
			</div>

			<div className="row mt-1 py-1 border-top border-info border-2">
				{spells}
			</div>
		</section>
	);
}
