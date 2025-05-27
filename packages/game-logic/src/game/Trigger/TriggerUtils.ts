import { Ability } from "@/game/Ability/Ability";
import { TriggerAbility } from "@/game/Trigger/TriggerTypes";

export function getTriggerAbilityFromAbility(ability: Ability): TriggerAbility {
	return {
		id: ability.id,
		sourceId: ability.sourceId,
		triggers: ability.triggers,
	};
}
