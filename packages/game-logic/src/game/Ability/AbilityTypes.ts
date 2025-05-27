import { Cooldown, PossibleAbilityModTemplate } from "@/game/Mod/ModTypes";
import { TAG } from "@/game/Tag/TagTypes";
import { Tier } from "@/game/Tier/TierTypes";
import { TriggerWithFilters } from "@/game/Trigger/TriggerTypes";

export type AbilityData = {
	name: string;
	tags: TAG[];
	minimumTier: Tier;
	cooldown: Cooldown;
	effects: PossibleAbilityModTemplate[];
	triggers?: TriggerWithFilters[];
};
