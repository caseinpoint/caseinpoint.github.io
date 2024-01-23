"use strict";

const LEVELS = ["1 Multiclass", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const FEAT_TIERS = [
		["adv", "Adventurer"],
		["chmp", "Champion"],
		["epic", "Epic"],
	];

function OptionsMenu(props) {
	/* React component: Select character talents and feats */

	const [optsHidden, setOptsHidden] = React.useState(true);

	function handleHide(evt) {
		setOptsHidden((prevHidden) => !prevHidden);
	}

	function handleLvlSelect(evt) {
		const newOpts = { ...props.options };
		const lvl = Number(evt.target.value);
		newOpts.charLvl = lvl;
		props.updateOptions(newOpts);
	}

	function handleCheck(evt) {
		const check = evt.target;
		const category = check.dataset.optCategory;
		const subcategory = check.dataset.optSubcategory;

		const newOpts = { ...props.options };

		if (category === "weirdnessFeats") {
			newOpts[category][check.value] = check.checked;
		} else if (check.value === "hasTalent" || category === "spellFeats") {
			newOpts[category][subcategory][check.value] = check.checked;
		} else if (["adv", "chmp", "epic"].includes(check.value)) {
			newOpts[category][subcategory].feats[check.value] = check.checked;
		}

		props.updateOptions(newOpts);
	}

	const levelOpts = LEVELS.map((lvl, idx) => (
		<option key={`charLvl${idx}`} value={idx}>
			Level {lvl}
		</option>
	));

	let weirdFeats = null;
	if (props.options.weirdnessFeats) {
		weirdFeats = FEAT_TIERS.map((item) => {
			const [tier, tierName] = item;

			return (
				<div
					key={`weirdFeat_${tier}`}
					className="form-check form-check-inline form-switch"
				>
					<input
						id={`weirdFeat_${tier}`}
						className="form-check-input"
						type="checkbox"
						value={tier}
						data-opt-category="weirdnessFeats"
						data-opt-subcategory="null"
						checked={props.options.weirdnessFeats[tier]}
						onChange={handleCheck}
					/>
					<label for={`weirdFeat_${tier}`} className="form-check-label">
						{tierName}
					</label>
				</div>
			);
		});
	}

	let warpTalents = null;
	if (props.talents.warpTalents) {
		warpTalents = Object.entries(props.talents.warpTalents).map(
			(item, idx) => {
				const [key, talent] = item;

				const featChecks = FEAT_TIERS.map((item) => {
					const [tier, tierName] = item;
					return (
						<div
							key={`warpTal${idx}_${tier}`}
							className="form-check form-check-inline form-switch"
						>
							<input
								id={`warpTal${idx}_${tier}`}
								className="form-check-input"
								type="checkbox"
								value={tier}
								data-opt-category="warpTalents"
								data-opt-subcategory={key}
								checked={props.options.warpTalents[key].feats[tier]}
								onChange={handleCheck}
							/>
							<label
								for={`warpTal${idx}_${tier}`}
								className="form-check-label"
							>
								{tierName}
							</label>
						</div>
					);
				});

				return (
					<div key={`warpTal${idx}`} className="py-1 border-top">
						<div className="form-check form-switch">
							<input
								id={`warpTal${idx}`}
								className="form-check-input"
								type="checkbox"
								value="hasTalent"
								data-opt-category="warpTalents"
								data-opt-subcategory={key}
								checked={props.options.warpTalents[key].hasTalent}
								onChange={handleCheck}
							/>
							<label for={`warpTal${idx}`} className="form-check-label">
								{talent.name}
							</label>
						</div>
						{featChecks}
					</div>
				);
			}
		);
	}

	let casterTalents = null;
	if (props.talents.casterTalents) {
		casterTalents = Object.entries(props.talents.casterTalents).map(
			(item, idx) => {
				const [key, talent] = item;

				const featChecks = FEAT_TIERS.map((item) => {
					const [tier, tierName] = item;
					return (
						<div
							key={`casterTal${idx}_${tier}`}
							className="form-check form-check-inline form-switch"
						>
							<input
								id={`casterTal${idx}_${tier}`}
								className="form-check-input"
								type="checkbox"
								value={tier}
								data-opt-category="casterTalents"
								data-opt-subcategory={key}
								checked={props.options.casterTalents[key].feats[tier]}
								onChange={handleCheck}
							/>
							<label
								for={`casterTal${idx}_${tier}`}
								className="form-check-label"
							>
								{tierName}
							</label>
						</div>
					);
				});

				return (
					<div key={`casterTal${idx}`} className="py-1 border-top">
						<div className="form-check form-switch">
							<input
								id={`casterTal${idx}`}
								className="form-check-input"
								type="checkbox"
								value="hasTalent"
								data-opt-category="casterTalents"
								data-opt-subcategory={key}
								checked={props.options.casterTalents[key].hasTalent}
								onChange={handleCheck}
							/>
							<label for={`casterTal${idx}`} className="form-check-label">
								{talent.name}
							</label>
						</div>
						{featChecks}
					</div>
				);
			}
		);
	}

	let spellFeats = null;
	if (props.talents.spellFeats) {
		spellFeats = props.talents.spellFeats.map((feat, idx) => {
			const featChecks = FEAT_TIERS.map((item) => {
				const [tier, tierName] = item;

				return (
					<div
						key={`spellFeat${idx}_${tier}`}
						className="form-check form-check-inline form-switch"
					>
						<input
							id={`spellFeat${idx}_${tier}`}
							className="form-check-input"
							type="checkbox"
							value={tier}
							data-opt-category="spellFeats"
							data-opt-subcategory={feat}
							checked={props.options.spellFeats[feat][tier]}
							onChange={handleCheck}
						/>
						<label
							for={`spellFeat${idx}_${tier}`}
							className="form-check-label"
						>
							{tierName}
						</label>
					</div>
				);
			});

			return (
				<div key={`spellFeat${idx}`} className="py-1 border-top">
					<p className="m-0">{feat}</p>
					{featChecks}
				</div>
			);
		});
	}

	const hide = optsHidden ? " d-none" : "";
	const upDown = optsHidden ? "▽" : "△";

	// render
	return (
		<section
			key="OptionsMenu"
			className="row py-1 border-top border-4 border-primary"
		>
			<button className="btn" onClick={handleHide}>
				<h3 className="text-center">Character Options {upDown}</h3>
			</button>

			<div
				className={`col-12 col-md-6 col-xl-3 py-1 border border-2
				border-info rounded${hide}`}
			>
				<h4 className="text-center">Character Level</h4>
				<select
					className="form-control"
					value={props.options.charLvl}
					data-opt-category="charLvl"
					data-opt-subcategory={false}
					onChange={handleLvlSelect}
				>
					{levelOpts}
				</select>

				<div className="mt-4 py-1 border-top border-2 border-info">
					<h4 className="text-center">High Weirdness Feats</h4>
					{weirdFeats}
				</div>
			</div>

			<div
				className={`col-12 col-md-6 col-xl-3 py-1 border border-2
				border-info rounded${hide}`}
			>
				<h4 className="text-center">Warp Talents</h4>
				{warpTalents}
			</div>

			<div
				className={`col-12 col-md-6 col-xl-3 py-1 border border-2
				border-info rounded${hide}`}
			>
				<h4 className="text-center">Spellcaster Class Talents</h4>
				{casterTalents}
			</div>

			<div
				className={`col-12 col-md-6 col-xl-3 py-1 border border-2
				border-info rounded${hide}`}
			>
				<h4 className="text-center">Spell Feats</h4>
				{spellFeats}
			</div>
		</section>
	);
}
