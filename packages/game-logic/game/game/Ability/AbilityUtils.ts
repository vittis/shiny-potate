import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { filterModsByType } from "../Mods/ModsUtils";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { PossibleTriggerEffect, TRIGGER, TRIGGER_EFFECT_TYPE } from "../Trigger/TriggerTypes";
import { Abilities } from "../data";
import { Ability } from "./Ability";
import {
	ABILITY_MOD_TYPES,
	AbilityModifier,
	AbilityModifierPossibleEffectMods,
	UniqueAbilityModifier,
} from "./AbilityTypes";

function filterAbilityMods(mods: PossibleMods): Mod<MOD_TYPE.GRANT_ABILITY>[] {
	return filterModsByType(mods, MOD_TYPE.GRANT_ABILITY);
}

export function getAbilitiesInstancesFromMods(mods: PossibleMods) {
	const abilityMods = filterAbilityMods(mods);

	return abilityMods.map(mod => {
		const name = mod.payload.name;
		const nameWithoutSpaces = name.replace(/\s/g, "");

		if (!Abilities[nameWithoutSpaces]) {
			throw Error(
				`Could not find ability ${name}. If running from a test make sure that it is mocked.`,
			);
		}

		return new Ability(Abilities[nameWithoutSpaces] as any);
	});
}

export function isUniqueAbilityModifier(
	modifier: AbilityModifier,
): modifier is UniqueAbilityModifier {
	return (modifier as UniqueAbilityModifier).unique === true;
}

export function getEffectsFromModifiers(
	modifiers: AbilityModifierPossibleEffectMods[],
): PossibleTriggerEffect[] {
	// TODO: implement remove
	const effects = modifiers.map(mod => {
		let payload;

		if (mod.type == ABILITY_MOD_TYPES.STATUS_EFFECT) {
			payload = [
				{
					name: mod.payload.name,
					quantity: mod.payload.value,
				},
			];
		} else if (mod.type == ABILITY_MOD_TYPES.DISABLE) {
			payload = [
				{
					name: mod.payload.name,
					duration: mod.payload.value,
				},
			];
		} else {
			payload = {
				value: mod.payload.value,
			};
		}

		const effect = {
			// @ts-ignore
			type: mod.type as TRIGGER_EFFECT_TYPE,
			trigger: TRIGGER.ON_USE, // TODO: using on use for now, maybe change later
			target: mod.payload.target as TARGET_TYPE,
			conditions: [],
			payload,
		} as PossibleTriggerEffect;

		return effect;
	});

	return effects;
}
