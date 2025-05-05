import { InstantEffectPayloadValue } from "../Ability/AbilityTypes";
import {
	Mod,
	MOD,
	ModPayloadMap,
	ModTemplate,
	ModTemplatePayloadMap,
	PossibleMod,
} from "./ModTypes";

export function filterModsByType<T extends MOD>(mods: PossibleMod[], type: MOD) {
	return mods.filter(mod => mod.type === type) as Mod<T>[];
}

/* export function convertModTemplateToMod<T extends MOD>(
	modTemplate: ModTemplate<T>,
	originId: string,
	tier: number,
): Mod<T> {
	// TODO: implement this
}
 */

export function convertModTemplateToMod<T extends MOD>(
	modTemplate: ModTemplate<T>,
	originId: string,
	tier: number,
): Mod<T> {
	let modPayload: ModPayloadMap[T];

	if (modTemplate.type === MOD.STAT) {
		// create another function to calculate value based on all values and quantity with different rules
		modPayload = {
			stat: modTemplate.payload.stat,
			category: modTemplate.payload.category,
			value: extractTieredValue(modTemplate.payload.values, "BASE", tier),
		} as ModPayloadMap[T];

		console.log("modPayload", modPayload);
	} else if (modTemplate.type === MOD.EFFECT) {
		modPayload = modTemplate.payload.map(effect => ({ ...effect })) as ModPayloadMap[T];
	} else {
		modPayload = modTemplate.payload.map(effect => ({ ...effect })) as ModPayloadMap[T];
	}

	return {
		type: modTemplate.type,
		targets: modTemplate.targets,
		conditions: modTemplate.conditions,
		payload: modPayload,
	};
}

function extractTieredValue(
	valuesArray: InstantEffectPayloadValue[],
	ref: string,
	tier: number,
): number {
	const valueEntry = valuesArray.find(entry => entry.ref === ref);
	return valueEntry?.values[tier - 1] ?? 0;
}
