import { nanoid } from "nanoid";
import {
	INSTANT_EFFECT,
	Mod,
	MOD,
	ModEffectPayload,
	ModEffectPayloadTemplate,
	ModGainAbilityPayload,
	ModGainAbilityPayloadTemplate,
	ModPayloadMap,
	ModPayloadValue,
	ModStatPayload,
	ModStatPayloadTemplate,
	ModTemplate,
	ModTemplatePayloadMap,
	PossibleAbilityMod,
	PossibleAbilityModTemplate,
	PossibleMod,
	PossibleModTemplate,
} from "./ModTypes";
import { StatModifierType } from "../Stats/StatsTypes";

export function filterModsByType<T extends MOD>(mods: PossibleMod[], type: MOD) {
	return mods.filter(mod => mod.type === type) as Mod<T>[];
}

export function convertModTemplateToMod(
	modTemplate: PossibleModTemplate | PossibleAbilityModTemplate,
	tier: number,
	sourceId: string,
): PossibleMod | PossibleAbilityMod {
	let modPayload: ModPayloadMap[MOD];

	switch (modTemplate.type) {
		case MOD.STAT: {
			const statPayload = modTemplate.payload as ModStatPayloadTemplate[];
			modPayload = statPayload.map(payload => ({
				stat: payload.stat,
				category: payload.category,
				...(payload.stat === "STATUS_EFFECT_MODIFIER" && {
					statusEffect: payload.statusEffect,
				}),
				tags: payload.tags || [],
				value: extractTieredValue(payload.values, tier),
			})) as ModPayloadMap[MOD.STAT];
			break;
		}

		case MOD.EFFECT: {
			const effectPayload = modTemplate.payload as ModEffectPayloadTemplate[];
			modPayload = effectPayload.map(payload => ({
				effect: payload.effect,
				...(payload.effect === "STATUS_EFFECT" && {
					statusEffect: payload.statusEffect,
				}),
				value: extractTieredValue(payload.values, tier),
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
		triggers: modTemplate.triggers || [],
		payload: modPayload,
		sourceId,
		id: nanoid(8),
	} as PossibleMod;
}

// TODO: take quantity rules and filter into account
function extractTieredValue(values: ModPayloadValue[], tier: number): number {
	let totalValue = 0;
	values.map(value => {
		const tieredValue = value.values[tier - 1] ?? 0;
		totalValue += tieredValue;
	});

	return totalValue;
}

export function convertInstantEffectToStatModifierType(
	instantEffect: INSTANT_EFFECT,
): StatModifierType {
	switch (instantEffect) {
		case INSTANT_EFFECT.DAMAGE:
			return "DAMAGE_MODIFIER";
		case INSTANT_EFFECT.HEAL:
			return "HEAL_MODIFIER";
		case INSTANT_EFFECT.APPLY_SHIELD:
			return "APPLY_SHIELD_MODIFIER";
		case INSTANT_EFFECT.STATUS_EFFECT:
			return "STATUS_EFFECT_MODIFIER";
		default:
			throw new Error(
				`convertInstantEffectToStatModifierType - Unknown instant effect: ${instantEffect}`,
			);
	}
}
