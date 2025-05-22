import { nanoid } from "nanoid";
import { Equipment } from "../Equipment/Equipment";
import { PossibleAbilityMod } from "../Mod/ModTypes";
import { convertModTemplateToMod } from "../Mod/ModsUtils";
import { PackUnit } from "../PackUnit/PackUnit";
import { TAG } from "../Tag/TagTypes";
import { MAX_TIER, Tier } from "../Tier/TierTypes";
import { TriggerWithFilters } from "../Trigger/TriggerTypes";
import { AbilityData } from "./AbilityTypes";

export class Ability {
	id: string;
	name: string;
	data: AbilityData;

	tier: Tier;
	tags: TAG[];

	currentCooldown: number; // cooldown calculated with stats and status effects that change the value
	cooldown: number; // cooldown fixed based on tier
	progress: number;

	currentEffects: PossibleAbilityMod[]; // effects calculated with stats and status effects that change the values
	effects: PossibleAbilityMod[]; // effects fixed based on tier

	triggers: TriggerWithFilters[];

	sourceId: string | null; // id of the source that created this ability, can be PackUnit or Equipment
	isLinkedToSource: boolean; // only when source is Equipment, if true means this ability is the equipment's ability

	constructor(data: AbilityData, tier: Tier = 1, source: PackUnit | Equipment | null = null) {
		if (!data) {
			throw Error(
				"Ability: Ability is undefined. If running from test make sure it's defined in mock files",
			);
		}

		this.id = nanoid(8);
		this.name = data.name;
		this.data = data;
		this.tags = [...data.tags, ...(source ? source.tags : [])];
		this.tier = tier;
		this.cooldown = data.cooldown[this.tier - 1] || 0;
		this.currentCooldown = this.cooldown;
		this.progress = 0;
		this.effects = data.effects
			.filter(mod => !mod.minimumTier || mod.minimumTier <= tier)
			.map(mod => convertModTemplateToMod(mod, tier, this.id)) as PossibleAbilityMod[];
		this.currentEffects = this.effects;
		this.triggers = data.triggers || [];
		this.sourceId = source ? source.id : null;
		this.isLinkedToSource = source instanceof Equipment && source.data?.ability == this.name;
	}

	step() {
		if (this.currentCooldown !== 0) this.progress += 1;
	}

	canActivate() {
		return this.currentCooldown !== 0 && this.progress >= this.currentCooldown;
	}

	modifyCooldown() {
		// TODO: implement
	}

	use() {
		// TODO: implement
		// when ability hits: trigger ON HIT effects
		// trigger ON USE effects once - at beginning or end?
	}

	getInstantEffectModifiers() {
		// TODO: implement this, generate new currentEffects based on effects and instantEffectModifiers
	}

	createAbilityIntent() {
		// TODO: implement this when doing intent / event stuff
	}

	canUpgradeTier() {
		return this.tier < MAX_TIER;
	}

	upgradeTier() {
		if (this.canUpgradeTier()) {
			this.tier += 1;

			this.cooldown = this.data.cooldown[this.tier - 1] || 0;
			this.currentCooldown = this.cooldown; // todo: create function to calculate new current cooldown

			this.effects = this.data.effects
				.filter(mod => !mod.minimumTier || mod.minimumTier <= this.tier)
				.map(mod => convertModTemplateToMod(mod, this.tier, this.id)) as PossibleAbilityMod[];
			this.currentEffects = this.effects;
			// after upgrading ability tier, always call AbilityManager function updateAbilitiesEffectsWithStats on unit to update currentEffects
		}
	}
}
