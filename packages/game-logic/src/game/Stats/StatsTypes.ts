import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TAG } from "../Tag/TagTypes";
import { TieredValues } from "../Tier/TierTypes";

export enum STAT {
	HP = "HP",
	SHIELD = "SHIELD",
	EFFECT_MODIFIER = "EFFECT_MODIFIER",
}

export type Hp = TieredValues;

export type UnitStats = {
	hp: number;
	maxHp: number;
	shield: number;
	statEffects: StatEffects;
};

export type ModifierType = "FLAT" | "PERCENTAGE";

export type StatEffectModifierType =
	| "COOLDOWN"
	| "HP"
	| "DAMAGE"
	| "HEAL"
	| "GAIN_HEAL"
	| "SHIELD"
	| "GAIN_SHIELD"
	| keyof typeof STATUS_EFFECT;

export type StatEffectModifier = {
	effect: StatEffectModifierType;
	modifierType: ModifierType;
	value: number;
	requiredTags: TAG[];
};

export type StatEffects = Record<StatEffectModifierType, Record<ModifierType, number>>;
