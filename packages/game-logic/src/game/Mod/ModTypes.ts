import {
	Filter,
	FILTER_TYPE,
	InstantEffectPayloadQuantity,
	InstantEffectPayloadValue,
} from "../Ability/AbilityTypes";
import { PossibleCondition } from "../Condition/ConditionTypes";
import { ModifierCategory, ModifierType, StatModifier } from "../Stats/StatsTypes";
import { TAG } from "../Tag/TagTypes";
import { TARGET_TYPE, TargetWithFilters } from "../Target/TargetTypes";
import { Tier } from "../Tier/TierTypes";

export enum MOD {
	STAT = "STAT",
	EFFECT = "EFFECT", // sera se chama de ability ou trigger? TRIGGER + EFFECT + TARGET
	ABILITY = "GAIN_ABILITY", // grant ability to unit
	// maybe call GRANT_STAT/EFFECT/ABILITY or STAT/EFFECT_MODIFIER ?
}

export type PossibleMod = Mod<MOD.STAT> | Mod<MOD.EFFECT> | Mod<MOD.ABILITY>;

// Final Mod

export type Mod<T extends MOD> = {
	type: T;
	targets: TargetWithFilters;
	conditions: PossibleCondition[];
	payload: ModPayloadMap[T];
};

export type ModPayloadMap = {
	[MOD.STAT]: ModStatPayload[];
	[MOD.EFFECT]: ModEffectPayload[];
	[MOD.ABILITY]: ModAbilityPayload[];
};

export type ModEffectPayload = {
	// todo: implement this
};

export type ModAbilityPayload = {
	name: string; // name of the ability
};

export type ModStatPayload = {
	stat: ModifierType;
	category: ModifierCategory;
	value: number;
	tag: TAG[];
};

// Mod Template

export type ModPayloadTemplateValue = InstantEffectPayloadValue;
export type ModPayloadTemplateQuantity = InstantEffectPayloadQuantity;

export type PossibleModTemplate =
	| ModTemplate<MOD.STAT>
	| ModTemplate<MOD.EFFECT>
	| ModTemplate<MOD.ABILITY>;

export type ModTemplate<T extends MOD> = {
	type: T;
	minimumTier: Tier; // tier to gain the mod
	targets: TargetWithFilters;
	conditions: PossibleCondition[];
	payload: ModTemplatePayloadMap[T];
};

export type ModTemplatePayloadMap = {
	[MOD.STAT]: ModStatPayloadTemplate[];
	[MOD.EFFECT]: ModEffectPayloadTemplate[];
	[MOD.ABILITY]: ModAbilityPayloadTemplate[];
};

export type ModEffectPayloadTemplate = {
	// todo: implement this
};

export type ModAbilityPayloadTemplate = {
	name: string; // name of the ability
};

// this mod add fixed modifiers
export type ModStatPayloadTemplate = {
	stat: ModifierType;
	category: ModifierCategory;
	values: ModPayloadTemplateValue[]; // Tiered values
	quantity: ModPayloadTemplateQuantity[];
	tag: TAG[];
};
