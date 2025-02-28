import { nanoid } from "nanoid";
import { AbilityData, Cooldown, PossibleInstantEffect } from "./AbilityTypes";
import { Tier } from "../Tier/TierTypes";

export class Ability {
	id: string;
	data: AbilityData;

	tier: Tier;

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

	// values from data, sepa nem precisa
	minimumTier: number;
	cooldownPerTier: Cooldown;

	constructor(data?: AbilityData) {
		if (!data) {
			throw Error(
				"Ability is undefined. If running from test make sure it's defined in mock files",
			);
		}

		this.data = data;
		this.id = nanoid(8);
		this.minimumTier = data.minimumTier;
		this.tier = data.minimumTier; // TODO: replace with correct tier instead of json minimum tier
		this.cooldownPerTier = data.cooldown;
		this.cooldown = this.cooldownPerTier[this.tier - 1] || 0;
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
		// at the end: trigger ON USE effects
	}

	getInstantEffectModifiers() {
		// TODO: implement this, generate new currentEffects based on effects and instantEffectModifiers
	}

	createAbilityIntent() {
		// TODO: implement this when doing intent / event stuff
	}
}
