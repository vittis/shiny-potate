import { Cooldown, PossibleAbilityModTemplate } from "../Mod/ModTypes";
import { TAG } from "../Tag/TagTypes";
import { Tier } from "../Tier/TierTypes";
import { TriggerWithFilters } from "../Trigger/TriggerTypes";

export type AbilityData = {
	name: string;
	tags: TAG[];
	minimumTier: Tier;
	cooldown: Cooldown;
	effects: PossibleAbilityModTemplate[];
	triggers?: TriggerWithFilters[];
};
