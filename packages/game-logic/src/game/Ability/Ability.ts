import { nanoid } from "nanoid";
import { AbilityData, Cooldown, PossibleInstantEffect } from "./AbilityTypes";
import { MAX_TIER, Tier } from "../Tier/TierTypes";
import { TAG } from "../Tag/TagTypes";

export class Ability {
	id: string;
	data: AbilityData;

	tier: Tier;
	tags: TAG[];

	currentCooldown: number; // cooldown current calculated with effects that change the value
	cooldown: number; // cooldown fixed based on tier
	progress: number;

	currentEffects: PossibleInstantEffect[]; // effects current calculated with instantEffectModifiers that change the value
	effects: PossibleInstantEffect[]; // effects fixed based on tier

	triggers: string[]; // TODO: create TRIGGER enum

	/* 
    TODO: create this type based on IncreaseEffect stuff
    instantEffectModifiers: {
        damage: number;
        heal: number;
        shield: number;
        statusEffect: {
            haste: number;
            multistrike: number;
            poison: number;
            regen: number;
            slow: number;
            stun: number;
            taunt: number;
            thorns: number;
        }
    } */

	constructor(data?: AbilityData, tier: Tier = 1) {
		if (!data) {
			throw Error(
				"Ability: Ability is undefined. If running from test make sure it's defined in mock files",
			);
		}

		this.id = nanoid(8);
		this.data = data;
		this.tags = data.tags;
		this.tier = tier;
		this.cooldown = data.cooldown[this.tier - 1] || 0;
		this.currentCooldown = this.cooldown;
		this.progress = 0;
		this.effects = data.effects;
		this.currentEffects = this.effects;
		this.triggers = []; // sepa adicionar triggers no AbilityData se for ter abilities que já começam com algum trigger
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
		}
	}
}
