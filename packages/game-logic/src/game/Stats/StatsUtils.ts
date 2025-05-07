import { MOD, Mod } from "../Mod/ModTypes";
import { StatModifier } from "./StatsTypes";

export function convertStatModToStatModifier(mod: Mod<MOD.STAT>): StatModifier[] {
	const statModifiers = mod.payload.map(payload => {
		return {
			type: payload.stat,
			category: payload.category,
			value: payload.value,
			tags: payload.tags,
			...(payload.stat === "STATUS_EFFECT_MODIFIER" && {
				statusEffect: payload.statusEffect,
			}),
			originId: mod.originId,
			modId: mod.id,
		};
	}) as StatModifier[];

	return statModifiers;
}
