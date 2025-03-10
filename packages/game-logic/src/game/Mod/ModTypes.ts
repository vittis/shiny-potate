import { InstantEffectPayloadQuantity, InstantEffectPayloadValue } from "../Ability/AbilityTypes";
import { PossibleCondition } from "../Condition/ConditionTypes";
import { STAT } from "../Stats/StatsTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { Tier } from "../Tier/TierTypes";

export enum MOD {
	STAT = "STAT",
	EFFECT = "EFFECT", // sera se chama de ability ou trigger? TRIGGER + EFFECT + TARGET
	ABILITY = "ABILITY", // grant ability to unit
	// maybe call GRANT_STAT/EFFECT/ABILITY or STAT/EFFECT_MODIFIER ?
}

export type ModPayloadValue = InstantEffectPayloadValue;
export type ModPayloadQuantity = InstantEffectPayloadQuantity;

export type PossibleMod = Mod<MOD.STAT> | Mod<MOD.EFFECT> | Mod<MOD.ABILITY>;

export type Mod<T extends MOD> = {
	type: T;
	minimumTier: Tier; // tier to gain the mod
	targets: TARGET_TYPE[];
	conditions: PossibleCondition[];
	payload: ModPayloadMap[T];
};

export type ModPayloadMap = {
	[MOD.STAT]: ModStatPayload;
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
	stat: STAT;
	values: ModPayloadValue[];
	quantity: ModPayloadQuantity[];
};
