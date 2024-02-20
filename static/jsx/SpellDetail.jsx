"use strict";

function SpellDetail(props) {
	/* React component: Display all the details for a spell */

	let castLvl = 1;
	if (props.options.charLvl && props.lvlProgression.spellLvl) {
		castLvl = props.lvlProgression.spellLvl[props.options.charLvl];
	}
	const HIGHLIGHTCLASS = "bg-primary bg-gradient";
	const hLight = props.spell.level === castLvl ? HIGHLIGHTCLASS : "";
	let cantCast = "";
	if (props.spell.level) {
		if (props.spell.level > castLvl) {
			cantCast = " text-secondary";
		}
	}

	let level = null;
	if (props.spell.level && props.spell.level < 10) {
		level = `(Level ${props.spell.level}+)`
	}

	let typeFreq = null;
	if (props.spell.type) {
		typeFreq = (
			<p className="my-1">
				{props.spell.type}{" "}
				<span className="fw-bold">◆ {props.spell.frequency}</span>
			</p>
		);
	}

	let action = null;
	if (props.spell.action) {
		action = (
			<p className="my-1">
				<span className="fw-bold">Action:</span> {props.spell.action}
			</p>
		);
	}

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
				<span className="fw-bold">Effect:</span>{" "}
				<span className={hLight}>{props.spell.effect}</span>
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
				<span className="fw-bold">Hit:</span>{" "}
				<span className={hLight}>{props.spell.hit}</span>
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
				const advHLight = lvl === castLvl ? HIGHLIGHTCLASS : "";
				levels.push(
					<li key={`advLvl${lvl}`}>
						<span className="fw-semibold">Level {lvl}:</span>{" "}
						<span className={advHLight}>{props.spell.advancement[lvl]}</span>
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
		for (let [tier, tierName] of FEAT_TIERS) {
			let featHLight = "";
			if (
				props.spell.title in props.options.spellFeats &&
				props.options.spellFeats[props.spell.title][tier] &&
				cantCast === ""
			) {
				featHLight = HIGHLIGHTCLASS;
			} else if (
				props.feat !== null &&
				props.options.spellFeats[props.feat][tier] &&
				cantCast === ""
			) {
				featHLight = HIGHLIGHTCLASS;
			}

			if (props.spell.feats[tier]) {
				tiers.push(
					<li key={`featTier_${tier}`}>
						<span className="fw-semibold">{tierName}:</span>{" "}
						<span className={featHLight}>{props.spell.feats[tier]}</span>
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
			className={`col-12 col-lg-6 py-1 rounded border${cantCast}`}
			style={{ whiteSpace: "pre-wrap" }}
		>
			<h4>
				{props.spell.title} {level}
			</h4>
			{typeFreq}
			{action}
			{target}
			{special}
			{attack}
			{effect}
			{hit}
			{miss}
			{advancement}
			{feats}
		</div>
	);
}
