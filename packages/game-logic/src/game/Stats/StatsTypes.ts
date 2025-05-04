import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TAG } from "../Tag/TagTypes";
import { TieredValues } from "../Tier/TierTypes";

export type Hp = TieredValues;

export type UnitStats = {
	hp: number;
	maxHp: number;
	shield: number;
};

export type UnitModifiers = {
	modifier: ModifierType;
	category: ModifierCategory;
	value: number;
	requiredTags: TAG[];
};

export type ModifierCategory = "FLAT" | "PERCENTAGE" | "MULTIPLICATIVE";

export type ModifierType =
	// affect unit
	| "HP_MODIFIER"
	| "SHIELD_MODIFIER"
	| "GAIN_HEAL_MODIFIER"
	| "GAIN_SHIELD_MODIFIER"
	// affect ability
	| "COOLDOWN_MODIFIER"
	| "DAMAGE_MODIFIER"
	| "HEAL_MODIFIER"
	| "SHIELD_MODIFIER"
	| `${keyof typeof STATUS_EFFECT}_MODIFIER`;

export type StatModifier = Record<ModifierType, Record<ModifierType, number>>;
