import { Condition, PossibleCondition } from "../Condition/ConditionTypes";
import {
	Cooldown,
	MOD,
	Mod,
	PossibleAbilityModTemplate,
	TriggerWithFilters,
} from "../Mod/ModTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TAG } from "../Tag/TagTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { Tier, TieredValues } from "../Tier/TierTypes";

export type AbilityData = {
	name: string;
	tags: TAG[];
	minimumTier: Tier;
	cooldown: Cooldown;
	effects: PossibleAbilityModTemplate[];
	triggers?: TriggerWithFilters[];
};
