import data from "@/data";
import { AbilityData } from "@/game/Ability/AbilityTypes";

export function findMatchingAbility(abilityName: string): AbilityData {
	const matchedAbility = Object.values(data.Abilities).find(
		ability => ability.name === abilityName,
	);

	if (!matchedAbility) {
		throw Error("AbilityUtils: findMatchingAbility - Didn't find ability: " + abilityName);
	}

	return matchedAbility;
}
