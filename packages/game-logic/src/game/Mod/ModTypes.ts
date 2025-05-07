import {
	Filter,
	FILTER_TYPE,
	InstantEffectPayloadQuantity,
	InstantEffectPayloadValue,
} from "../Ability/AbilityTypes";
import { PossibleCondition } from "../Condition/ConditionTypes";
import { ModifierCategory, ModifierType, StatModifier } from "../Stats/StatsTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TAG } from "../Tag/TagTypes";
import { TARGET_TYPE, TargetWithFilters } from "../Target/TargetTypes";
import { Tier } from "../Tier/TierTypes";

export enum MOD {
	STAT = "STAT",
	EFFECT = "EFFECT",
	GAIN_ABILITY = "GAIN_ABILITY",
}

export type PossibleMod = Mod<MOD.STAT> | Mod<MOD.EFFECT> | Mod<MOD.GAIN_ABILITY>;

// Final Mod - Mod as is after being received by pack unit, equipment or ability
// with the tier, the minimumTier is removed and the payload is changed to remove values and quantity, replacing it with a single value

export type Mod<T extends MOD> = {
	type: T;
	targets: TargetWithFilters[];
	conditions: PossibleCondition[];
	payload: ModPayloadMap[T];
	originId: string;
	id: string;
};

export type ModPayloadMap = {
	[MOD.STAT]: ModStatPayload[];
	[MOD.EFFECT]: ModEffectPayload[];
	[MOD.GAIN_ABILITY]: ModGainAbilityPayload[];
};

export type ModEffectPayload = {
	// todo: implement this
};

export type ModGainAbilityPayload = {
	name: string; // name of the ability
};

export type ModStatPayloadBase = {
	category: ModifierCategory;
	value: number;
	tags: TAG[];
};

export type ModStatPayload =
	| (ModStatPayloadBase & {
			stat: Exclude<ModifierType, "STATUS_EFFECT_MODIFIER">;
	  })
	| (ModStatPayloadBase & {
			stat: "STATUS_EFFECT_MODIFIER";
			statusEffect: STATUS_EFFECT;
	  });

// Mod Template - Mod as is on json

export type ModPayloadTemplateValue = InstantEffectPayloadValue;
export type ModPayloadTemplateQuantity = InstantEffectPayloadQuantity;

export type PossibleModTemplate =
	| ModTemplate<MOD.STAT>
	| ModTemplate<MOD.EFFECT>
	| ModTemplate<MOD.GAIN_ABILITY>;

export type ModTemplate<T extends MOD> = {
	type: T;
	minimumTier: Tier; // tier to gain the mod
	targets: TargetWithFilters[];
	conditions: PossibleCondition[];
	payload: ModTemplatePayloadMap[T];
};

export type ModTemplatePayloadMap = {
	[MOD.STAT]: ModStatPayloadTemplate[];
	[MOD.EFFECT]: ModEffectPayloadTemplate[];
	[MOD.GAIN_ABILITY]: ModGainAbilityPayloadTemplate[];
};

export type ModEffectPayloadTemplate = {
	// todo: implement this
};

export type ModGainAbilityPayloadTemplate = {
	name: string; // name of the ability
};

export type ModStatPayloadTemplateBase = {
	category: ModifierCategory;
	values: ModPayloadTemplateValue[]; // Tiered values
	quantity: ModPayloadTemplateQuantity[];
	tags: TAG[];
};

export type ModStatPayloadTemplate =
	| (ModStatPayloadTemplateBase & {
			stat: Exclude<ModifierType, "STATUS_EFFECT_MODIFIER">;
	  })
	| (ModStatPayloadTemplateBase & {
			stat: "STATUS_EFFECT_MODIFIER";
			statusEffect: STATUS_EFFECT;
	  });
