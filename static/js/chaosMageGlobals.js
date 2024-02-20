"use strict";

/* Global variables */

const CATEGORIES = ["atk", "atk", "def", "def", "icn", "icn"];
const CAT_NAMES = { atk: "Attack", def: "Defense", icn: "Icon", null: "none" };
const FEAT_TIERS = [
	["adv", "Adventurer"],
	["chmp", "Champion"],
	["epic", "Epic"],
];
const HIGHLIGHT_CLASS = "bg-primary bg-gradient";
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
const LEVELS = ["1 Multiclass", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


/* Global functions */

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