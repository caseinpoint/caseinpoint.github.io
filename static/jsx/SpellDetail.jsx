"use strict";

const TIERS = [
	["adv", "Adventurer"],
	["chmp", "Champion"],
	["epic", "Epic"],
];

function SpellDetail(props) {
	/* React component: Display all the details for a spell */
	// TODO: highlight any selected feats in props.options

	let target = null;
	if (props.spell.target) {
		target = (
			<p className="my-1">
				<span className="fw-bold">Target:</span> {props.spell.target}
			</p>
		);
	}

	let special = null;
	if (props.spell.special) {
		special = (
			<p className="my-1">
				<span className="fw-bold">Special:</span> {props.spell.special}
			</p>
		);
	}

	let effect = null;
	if (props.spell.effect) {
		effect = (
			<p className="my-1">
				<span className="fw-bold">Effect:</span> {props.spell.effect}
			</p>
		);
	}

	let attack = null;
	if (props.spell.attack) {
		attack = (
			<p className="my-1">
				<span className="fw-bold">Attack:</span> {props.spell.attack}
			</p>
		);
	}

	let hit = null;
	if (props.spell.hit) {
		hit = (
			<p className="my-1">
				<span className="fw-bold">Hit:</span> {props.spell.hit}
			</p>
		);
	}

	let miss = null;
	if (props.spell.miss) {
		miss = (
			<p className="my-1">
				<span className="fw-bold">Miss:</span> {props.spell.miss}
			</p>
		);
	}

	let advancement = null;
	if (props.spell.advancement) {
		const levels = [];
		for (let lvl of [3, 5, 7, 9]) {
			if (props.spell.advancement[lvl]) {
				levels.push(
					<li key={`advLvl${lvl}`}>
						<span className="fw-semibold">Level {lvl}:</span>{" "}
						{props.spell.advancement[lvl]}
					</li>
				);
			}
		}

		advancement = (
			<p className="my-1">
				<span className="fw-bold">Advancement:</span>
				<ul>{levels}</ul>
			</p>
		);
	}

	let feats = null;
	if (props.spell.feats) {
		const tiers = [];
		for (let [tier, tierName] of TIERS) {
			if (props.spell.feats[tier]) {
				tiers.push(
					<li key={`featTier_${tier}`}>
						<span className="fw-semibold">{tierName}:</span>{" "}
						{props.spell.feats[tier]}
					</li>
				);
			}
		}

		feats = (
			<p className="my-1">
				<span className="fw-bold">Feats:</span>
				<ul>{tiers}</ul>
			</p>
		);
	}

	// render
	return (
		<div
			className="col-6 py-1 rounded border"
			style={{ whiteSpace: "pre-wrap" }}
		>
			<h4>
				{props.spell.title} (Level {props.spell.level}+)
			</h4>
			<p className="my-1">
				{props.spell.type}{" "}
				<span className="fw-bold">◆ {props.spell.frequency}</span>
			</p>
			{target}
			{special}
			{effect}
			{attack}
			{hit}
			{miss}
			{advancement}
			{feats}
		</div>
	);
}
