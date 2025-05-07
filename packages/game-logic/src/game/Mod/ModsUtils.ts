import { nanoid } from "nanoid";
import { InstantEffectPayloadValue } from "../Ability/AbilityTypes";
import {
	Mod,
	MOD,
	ModEffectPayload,
	ModEffectPayloadTemplate,
	ModGainAbilityPayload,
	ModGainAbilityPayloadTemplate,
	ModPayloadMap,
	ModStatPayload,
	ModStatPayloadTemplate,
	ModTemplate,
	ModTemplatePayloadMap,
	PossibleMod,
	PossibleModTemplate,
} from "./ModTypes";

export function filterModsByType<T extends MOD>(mods: PossibleMod[], type: MOD) {
	return mods.filter(mod => mod.type === type) as Mod<T>[];
}

export function convertModTemplateToMod(
	modTemplate: PossibleModTemplate,
	tier: number,
	originId: string,
): PossibleMod {
	let modPayload: ModPayloadMap[MOD];

	switch (modTemplate.type) {
		case MOD.STAT: {
			const statPayload = modTemplate.payload as ModStatPayloadTemplate[];
			modPayload = statPayload.map(payload => ({
				stat: payload.stat,
				category: payload.category,
				tags: payload.tags || [],
				...(payload.stat === "STATUS_EFFECT_MODIFIER" && {
					statusEffect: payload.statusEffect,
				}),
				value: extractTieredValue(payload.values, "BASE", tier), // TODO: implement this for any string instead of only BASE
			})) as ModPayloadMap[MOD.STAT];
			break;
		}

		case MOD.EFFECT: {
			// TODO: implement this
			const effectPayload = modTemplate.payload as ModEffectPayloadTemplate[];
			modPayload = effectPayload.map(payload => ({
				...payload,
			})) as ModPayloadMap[MOD.EFFECT];
			break;
		}

		case MOD.GAIN_ABILITY: {
			const gainAbilityPayload = modTemplate.payload as ModGainAbilityPayloadTemplate[];
			modPayload = gainAbilityPayload.map(payload => ({
				name: payload.name,
			})) as ModPayloadMap[MOD.GAIN_ABILITY];
			break;
		}
	}

	return {
		type: modTemplate.type,
		targets: modTemplate.targets,
		conditions: modTemplate.conditions,
		payload: modPayload,
		originId,
		id: nanoid(8),
	} as PossibleMod;
}

function extractTieredValue(
	valuesArray: InstantEffectPayloadValue[],
	ref: string,
	tier: number,
): number {
	const valueEntry = valuesArray.find(entry => entry.ref === ref);
	return valueEntry?.values[tier - 1] ?? 0;
}
