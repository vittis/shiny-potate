import { InstantEffectPayloadQuantity, InstantEffectPayloadValue } from "../Ability/AbilityTypes";
import { PossibleCondition } from "../Condition/ConditionTypes";
import { STAT } from "../Stat/StatTypes";

export enum MOD {
	STAT = "STAT",
	EFFECT = "EFFECT", // sera se chama de ability ou trigger? TRIGGER + EFFECT + TARGET
	// maybe call GRANT_STAT/EFFECT or STAT/EFFECT_MODIFIER ?
}

export type ModPayloadValue = InstantEffectPayloadValue;
export type ModPayloadQuantity = InstantEffectPayloadQuantity;

export type PossibleMod = Mod<MOD.STAT> | Mod<MOD.EFFECT>;

export type Mod<T extends MOD> = {
	type: T;
	targets: any[]; // TODO: create TARGET type
	conditions: PossibleCondition[];
	payload: ModPayloadMap[T];
};

export type ModPayloadMap = {
	[MOD.STAT]: ModStatPayload;
	[MOD.EFFECT]: ModEffectPayload[];
};

export type ModEffectPayload = {
	// todo: implement this
};

export type ModStatPayload = {
	stat: STAT;
	values: ModPayloadValue[];
	quantity: ModPayloadQuantity[];
};
