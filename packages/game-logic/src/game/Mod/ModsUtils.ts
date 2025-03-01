import { Mod, MOD, PossibleMod } from "./ModTypes";

export function filterModsByType<T extends MOD>(mods: PossibleMod[], type: MOD) {
	return mods.filter(mod => mod.type === type) as Mod<T>[];
}
