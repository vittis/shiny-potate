import { Ability } from "../Ability/Ability";
import { TriggerAbility } from "./TriggerTypes";

export function getTriggerAbilityFromAbility(ability: Ability): TriggerAbility {
	return {
		id: ability.id,
		sourceId: ability.sourceId,
		triggers: ability.triggers,
	};
}
