import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { filterModsByType } from "../Mods/ModsUtils";

export function filterStatsMods(mods: PossibleMods): Mod<MOD_TYPE.GRANT_BASE_STAT>[] {
	return filterModsByType(mods, MOD_TYPE.GRANT_BASE_STAT);
}

export function calculateDamage(damage: number, damageReduction: number): number {
	if (damage <= 0) return 0;

	const sign = damageReduction < 0 ? -1 : 1;

	const damageReduced = Math.round(damage / (1 + Math.abs(damageReduction) / 100));

	let finalDamage = damage;

	if (sign === 1) {
		finalDamage = Math.max(damageReduced, 0);
	} else {
		finalDamage = Math.max(damage * 2 - damageReduced, 0);
	}

	return finalDamage;
}
