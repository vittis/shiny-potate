import { Condition, PossibleCondition } from "../Condition/ConditionTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TAG } from "../Tag/TagTypes";
import { Tier, TieredValues } from "../Tier/TierTypes";

export enum INSTANT_EFFECT {
	DAMAGE = "DAMAGE",
	HEAL = "HEAL",
	SHIELD = "SHIELD",
	STATUS_EFFECT = "STATUS_EFFECT",
	INCREASE_EFFECT = "INCREASE_EFFECT",
}

export enum SCALING {
	PER_TARGET = "PER_TARGET",
}

export enum FILTER_TYPE {
	UNIT = "UNIT",
}

export type Cooldown = TieredValues;
export type EffectValue = TieredValues;

export type AbilityData = {
	name: string;
	tags: TAG[];
	minimumTier: Tier;
	cooldown: Cooldown;
	effects: PossibleInstantEffect[];
};

export type PossibleInstantEffect =
	| InstantEffect<INSTANT_EFFECT.DAMAGE>
	| InstantEffect<INSTANT_EFFECT.STATUS_EFFECT>
	| InstantEffect<INSTANT_EFFECT.SHIELD>
	| InstantEffect<INSTANT_EFFECT.HEAL>
	| InstantEffect<INSTANT_EFFECT.INCREASE_EFFECT>;

export type InstantEffect<T extends INSTANT_EFFECT> = {
	type: T;
	targets: any[]; // TODO: create TARGET type
	conditions: PossibleCondition[];
	payload: InstantEffectPayloadMap[T];
};

export type InstantEffectPayloadMap = {
	[INSTANT_EFFECT.DAMAGE]: DamagePayload;
	[INSTANT_EFFECT.STATUS_EFFECT]: StatusEffectPayload[];
	[INSTANT_EFFECT.SHIELD]: ShieldPayload;
	[INSTANT_EFFECT.HEAL]: HealPayload;
	[INSTANT_EFFECT.INCREASE_EFFECT]: IncreaseEffectPayload;
};

export type DamagePayload = {
	values: InstantEffectPayloadValue[];
	quantity: InstantEffectPayloadQuantity[];
};
export type ShieldPayload = {
	values: InstantEffectPayloadValue[];
	quantity: InstantEffectPayloadQuantity[];
};
export type HealPayload = {
	values: InstantEffectPayloadValue[];
	quantity: InstantEffectPayloadQuantity[];
};
export type StatusEffectPayload = {
	name: STATUS_EFFECT;
	values: InstantEffectPayloadValue[];
	quantity: InstantEffectPayloadQuantity[];
};
export type IncreaseEffectPayload = {
	// TODO: think about how to implement this
	values: InstantEffectPayloadValue[];
	quantity: InstantEffectPayloadQuantity[];
};

export type InstantEffectPayloadValue = {
	ref: string; // sera que padroniza com ENUM ou deixa string livre?
	values: EffectValue;
};

export type InstantEffectPayloadQuantity = {
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
	target: string; // TODO: replace with TARGET enum
};
