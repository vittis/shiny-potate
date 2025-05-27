import { Mod, MOD } from "@/game/Mod/ModTypes";
import { StatModifier } from "@/game/Stats/StatsTypes";

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
			sourceId: mod.sourceId,
			modId: mod.id,
		};
	}) as StatModifier[];

	return statModifiers;
}
