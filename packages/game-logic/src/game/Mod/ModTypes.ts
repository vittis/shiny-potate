import { PossibleCondition } from "@/game/Condition/ConditionTypes";
import { StatModifierCategory, StatModifierType } from "@/game/Stats/StatsTypes";
import { STATUS_EFFECT } from "@/game/StatusEffect/StatusEffectTypes";
import { TAG } from "@/game/Tag/TagTypes";
import { TARGET_TYPE, TargetWithFilters } from "@/game/Target/TargetTypes";
import { Tier, TieredValues } from "@/game/Tier/TierTypes";
import { TriggerWithFilters } from "@/game/Trigger/TriggerTypes";

export enum MOD {
	STAT = "STAT",
	EFFECT = "EFFECT",
	GAIN_ABILITY = "GAIN_ABILITY",
}

export enum SCALING {
	FIXED = "FIXED", // fixed value, if true apply once
	PER_TARGET = "PER_TARGET", // value is sum of each target that fulfills the filter condition
}

export enum FILTER_TYPE {
	ABILITY = "ABILITY", // sera q vai ter filter de ability?
	EQUIPMENT = "EQUIPMENT",
	UNIT = "UNIT",
}

export enum INSTANT_EFFECT {
	DAMAGE = "DAMAGE",
	HEAL = "HEAL",
	APPLY_SHIELD = "APPLY_SHIELD",
	STATUS_EFFECT = "STATUS_EFFECT",
}

export type Cooldown = TieredValues;
export type EffectValue = TieredValues;

export type PossibleAbilityMod = Mod<MOD.STAT> | Mod<MOD.EFFECT>;
export type PossibleMod = Mod<MOD.STAT> | Mod<MOD.EFFECT> | Mod<MOD.GAIN_ABILITY>;

// Final Mod - Mod as is after being received by pack unit, equipment or ability
// with the tier, the minimumTier is removed and the payload is changed to remove values and quantity, replacing it with a single value

export type Mod<T extends MOD> = {
	type: T;
	targets: TargetWithFilters[];
	conditions: PossibleCondition[];
	triggers: TriggerWithFilters[];
	payload: ModPayloadMap[T];
	sourceId: string;
	id: string;
};

export type ModPayloadMap = {
	[MOD.STAT]: ModStatPayload[];
	[MOD.EFFECT]: ModEffectPayload[];
	[MOD.GAIN_ABILITY]: ModGainAbilityPayload[];
};

export type ModEffectPayloadBase = {
	value: number;
};

export type ModEffectPayload =
	| (ModEffectPayloadBase & {
			effect: Exclude<INSTANT_EFFECT, "STATUS_EFFECT">;
	  })
	| (ModEffectPayloadBase & {
			effect: "STATUS_EFFECT";
			statusEffect: STATUS_EFFECT;
	  });

export type ModGainAbilityPayload = {
	name: string; // name of the ability
};

export type ModStatPayloadBase = {
	category: StatModifierCategory;
	value: number;
	tags: TAG[];
};

export type ModStatPayload =
	| (ModStatPayloadBase & {
			stat: Exclude<StatModifierType, "STATUS_EFFECT_MODIFIER">;
	  })
	| (ModStatPayloadBase & {
			stat: "STATUS_EFFECT_MODIFIER";
			statusEffect: STATUS_EFFECT;
	  });

// Mod Template - Mod as is on json

export type ModPayloadTemplateValue = ModPayloadValue;
export type ModPayloadTemplateQuantity = ModPayloadQuantity;

export type PossibleAbilityModTemplate = ModTemplate<MOD.STAT> | ModTemplate<MOD.EFFECT>;
export type PossibleModTemplate =
	| ModTemplate<MOD.STAT>
	| ModTemplate<MOD.EFFECT>
	| ModTemplate<MOD.GAIN_ABILITY>;

export type ModTemplate<T extends MOD> = {
	type: T;
	minimumTier?: Tier; // tier to gain the mod, if empty is by default 1
	targets: TargetWithFilters[];
	conditions: PossibleCondition[];
	triggers?: TriggerWithFilters[]; // only used for effect or stat mods that aren't part of an ability
	payload: ModTemplatePayloadMap[T];
};

export type ModTemplatePayloadMap = {
	[MOD.STAT]: ModStatPayloadTemplate[];
	[MOD.EFFECT]: ModEffectPayloadTemplate[];
	[MOD.GAIN_ABILITY]: ModGainAbilityPayloadTemplate[];
};

export type ModEffectPayloadTemplateBase = {
	values: ModPayloadTemplateValue[]; // Tiered values
	quantity: ModPayloadTemplateQuantity[];
};

export type ModEffectPayloadTemplate =
	| (ModEffectPayloadTemplateBase & {
			effect: Exclude<INSTANT_EFFECT, "STATUS_EFFECT">;
	  })
	| (ModEffectPayloadTemplateBase & {
			effect: "STATUS_EFFECT";
			statusEffect: STATUS_EFFECT;
	  });

export type ModGainAbilityPayloadTemplate = {
	name: string; // name of the ability
};

export type ModStatPayloadTemplateBase = {
	category: StatModifierCategory;
	values: ModPayloadTemplateValue[]; // Tiered values
	quantity: ModPayloadTemplateQuantity[];
	tags: TAG[];
};

export type ModStatPayloadTemplate =
	| (ModStatPayloadTemplateBase & {
			stat: Exclude<StatModifierType, "STATUS_EFFECT_MODIFIER">;
	  })
	| (ModStatPayloadTemplateBase & {
			stat: "STATUS_EFFECT_MODIFIER";
			statusEffect: STATUS_EFFECT;
	  });

export type ModPayloadValue = {
	ref: string; // sera que padroniza com ENUM ou deixa string livre?
	values: EffectValue;
};

export type ModPayloadQuantity = {
	ref: string;
	scaling?: SCALING;
	filters?: Filter[];
};

export type Filter = {
	type: FILTER_TYPE;
	payload: FilterPayload;
};

export type FilterPayload = {
	tags: TAG[];
	target: TARGET_TYPE;
};
