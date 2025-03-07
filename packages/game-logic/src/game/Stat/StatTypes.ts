import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TAG } from "../Tag/TagTypes";
import { TieredValues } from "../Tier/TierTypes";

export enum STAT {
	HP = "HP",
	SHIELD = "SHIELD",
	EFFECT_MODIFIER = "EFFECT_MODIFIER",
}

export type Hp = TieredValues;

export type ModifierType = "FLAT" | "PERCENTAGE";

export type EffectModifierType =
	| "COOLDOWN"
	| "HP"
	| "DAMAGE"
	| "HEAL"
	| "GAIN_HEAL"
	| "SHIELD"
	| "GAIN_SHIELD"
	| keyof typeof STATUS_EFFECT;

export type EffectModifier = {
	effect: EffectModifierType;
	modifierType: ModifierType;
	value: number;
	requiredTags: TAG[];
};
