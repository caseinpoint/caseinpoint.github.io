"use strict";

function SpellsContainer(props) {
	/* React component: Display all SpellDetails that are currently available */

	// state
	const [categories, setCategories] = React.useState([]);
	const [currentCategory, setCurrentCategory] = React.useState(null);
	const [currentIcon, setCurrentIcon] = React.useState(null);
	const [randBtn, setRandBtn] = React.useState(randomRGBA(0.25, 0.5));
	const [randULine, setRandULine] = React.useState(randomRGBA(0, 0));
	const [randColors, setRandColors] = React.useState([]);
	const [atkSpells, setAtkSpells] = React.useState([]);
	const [defSpells, setDefSpells] = React.useState([]);
	const [icnSpells, setIcnSpells] = React.useState([]);
	const [ncrSpells, setNcrSpells] = React.useState({});
	const [wizSpells, setWizSpells] = React.useState({});
	const [clrSpells, setClrSpells] = React.useState({});
	const [srcSpells, setSrcSpells] = React.useState({});
	// const [addSpells, setAddSpells] = React.useState([]);

	function updateCategories(newCategories) {
		/* Update categories state and save to localStorage */

		setCategories(newCategories);
		localStorage.setItem("categories", JSON.stringify(newCategories));
	}

	function updateCurrentCategory(newCategory) {
		/* Update currentCategory state and save to localStorage */

		if (newCategory === null) {
			setCurrentCategory(newCategory);
		} else {
			setCurrentCategory(() => {
				// initially set to null, then set to newCategory after 125ms delay
				setTimeout(() => setCurrentCategory(newCategory), 125);
				return null;
			});
		}

		localStorage.setItem("currentCategory", JSON.stringify(newCategory));
	}

	function updateCurrentIcon(newIcon) {
		/* Update currentIcon state and save to localStorage */

		if (newIcon === null) {
			setCurrentIcon(newIcon);
		} else {
			setCurrentIcon(() => {
				// initially set to null, then set to newIcon after 125ms delay
				setTimeout(() => setCurrentIcon(newIcon), 125);
				return null;
			});
		}

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

		const newAddSpells = [];

		if (props.options.casterTalents.necromancer.hasTalent) {
			newAddSpells.push(getRandElement(ncrSpells[castLvl]));
		}

		if (props.options.casterTalents.wizard.hasTalent) {
			newAddSpells.push(getRandElement(wizSpells[castLvl]));
		}

		if (props.options.casterTalents.cleric.hasTalent) {
			newAddSpells.push(getRandElement(clrSpells[castLvl]));
		}

		if (props.options.casterTalents.sorcerer.hasTalent) {
			newAddSpells.push(getRandElement(srcSpells[castLvl]));
		}

		props.setAddSpells(newAddSpells);
		localStorage.setItem("addSpells", JSON.stringify(newAddSpells));
	}

	function fetchAddSpells() {
		/* Get additional spells for spellcaster class talents from localStorage */

		const addSpellsStr = localStorage.getItem("addSpells");
		if (addSpellsStr !== null) {
			props.setAddSpells(JSON.parse(addSpellsStr));
		}
	}

	// on load
	React.useEffect(() => {
		fetchAllCategories();

		fetch("/chaosmage/static/json/attack.json")
			.then((response) => response.json())
			.then((atkJSON) => setAtkSpells(atkJSON));

		fetch("/chaosmage/static/json/defense.json")
			.then((response) => response.json())
			.then((defJSON) => setDefSpells(defJSON));

		fetch("/chaosmage/static/json/icon.json")
			.then((response) => response.json())
			.then((icnJSON) => setIcnSpells(icnJSON));

		fetch("/chaosmage/static/json/cleric.json")
			.then((response) => response.json())
			.then((clrJSON) => setClrSpells(clrJSON));

		fetch("/chaosmage/static/json/necromancer.json")
			.then((response) => response.json())
			.then((ncrJSON) => setNcrSpells(ncrJSON));

		fetch("/chaosmage/static/json/sorcerer.json")
			.then((response) => response.json())
			.then((srcJSON) => setSrcSpells(srcJSON));

		fetch("/chaosmage/static/json/wizard.json")
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

	function randomSpanColors() {
		/* Generate random BS colors for each letter of "Current Spells" H2 */

		const newRandColors = [];
		for (let i = 0; i < "Current Spells".length; i++) {
			newRandColors.push(getRandElement(TEXT_COLOR_CLASSES));
		}
		setRandColors(newRandColors);
	}

	function resetSpanColors() {
		setRandColors([]);
	}

	function handleNextCategory() {
		const newCategories =
			categories.length > 1 ? [...categories] : getCategoryArray();
		const newCategory = newCategories.pop();
		const newIcon = newCategory === "icn" ? getRandElement(ICONS) : null;

		updateCategories(newCategories);
		updateCurrentCategory(newCategory);
		updateCurrentIcon(newIcon);
		setRandULine(randomRGBA(0.95, 1.0));
		randomSpanColors();
	}

	function handleResetCategories() {
		updateCategories(getCategoryArray());
		updateCurrentCategory(null);
		updateCurrentIcon(null);
		setRandULine(randomRGBA(0, 0));
		props.updateEndCombat();
		resetSpanColors();
	}

	// handle Full Heal-Up
	React.useEffect(() => {
		if (props.fullHeal === true) {
			handleResetCategories();
			resetAddSpells();
		}
	}, [props.fullHeal]);

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

	const spellMap = (spell, idx) => {
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

	if (currentCategory === null) {
		spells.push(
			spellMap(
				{
					title: 'No current spells, click "Next Category" to begin combat',
					level: 0,
				},
				0
			)
		);
	} else if (currentCategory === "atk") {
		spells = atkSpells.map(spellMap);
	} else if (currentCategory === "def") {
		spells = defSpells.map(spellMap);
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
	if (props.addSpells) {
		for (let spell of props.addSpells) {
			if (spell.category === currentCategory) {
				spells.push(spellMap(spell, spell.title));
			}
		}
	}

	const currentSpellsStr = "Current Spells";
	const letterSpans = [];
	const colorClasses = [...randColors];
	for (let i in currentSpellsStr) {
		let colorClass = colorClasses.pop();
		if (colorClass === undefined) {
			colorClass = "";
		}

		letterSpans.push(
			<span key={`ltr_${i}`} className={colorClass}>
				{currentSpellsStr[i]}
			</span>
		);
	}

	// render
	return (
		<section
			key="SpellsContainer"
			className="row justify-content-center py-1 border-top border-4 border-primary"
		>
			<h2 className="text-center">{letterSpans}</h2>

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
					Current Category:{" "}
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
					className="btn btn-outline-secondary my-auto"
					onClick={handleResetCategories}
				>
					End Combat
				</button>
			</div>

			<div className="row mt-1 pt-2 border-top border-info-subtle border-2">
				{spells}
			</div>

			<WarpWeird
				currentCategory={currentCategory}
				warpTalents={props.talents.warpTalents}
				warpOptions={props.options.warpTalents}
				weirdOptions={props.options.weirdnessFeats}
			/>
		</section>
	);
}
