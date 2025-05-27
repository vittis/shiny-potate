import { STATUS_EFFECT } from "@/game/StatusEffect/StatusEffectTypes";
import { TAG } from "@/game/Tag/TagTypes";
import { TieredValues } from "@/game/Tier/TierTypes";

export type Hp = TieredValues;

export type UnitStats = {
	hp: number;
	maxHp: number;
	shield: number;
};

export type UnitModifiers = {
	modifier: StatModifierType;
	category: StatModifierCategory;
	value: number;
	requiredTags: TAG[];
};

export type StatModifierCategory = "FLAT" | "PERCENTAGE" | "MULTIPLICATIVE";

export type StatModifierType =
	// affect unit
	| "HP_MODIFIER"
	| "SHIELD_MODIFIER"
	| "GAIN_HEAL_MODIFIER"
	| "GAIN_SHIELD_MODIFIER"
	// affect ability
	| "COOLDOWN_MODIFIER"
	| "DAMAGE_MODIFIER"
	| "HEAL_MODIFIER"
	| "APPLY_SHIELD_MODIFIER"
	| "STATUS_EFFECT_MODIFIER";

export type StatModifierBase = {
	category: StatModifierCategory;
	value: number;
	tags: TAG[];
	sourceId: string;
	modId: string;
};

export type StatModifier =
	| (StatModifierBase & {
			type: Exclude<StatModifierType, "STATUS_EFFECT_MODIFIER">;
	  })
	| (StatModifierBase & {
			type: "STATUS_EFFECT_MODIFIER";
			statusEffect: STATUS_EFFECT;
	  });
