import { MOD, Mod } from "../Mod/ModTypes";
import { StatModifier, UnitStats } from "./StatsTypes";

export class StatsManager {
	stats: UnitStats;
	fixedModifiers: StatModifier[];
	temporaryModifiers: StatModifier[];
	activeStatMods: Mod<MOD.STAT>[];
	//private statsFromStatusEffects!: StatsFromStatusEffects;

	constructor() {
		this.stats = this.setInitialUnitStats();
		this.fixedModifiers = [];
		this.temporaryModifiers = [];
		this.activeStatMods = [];
	}

	getStats(): UnitStats {
		return this.stats;
	}

	getActiveStatMods() {
		return this.activeStatMods;
	}

	setBaseHp(hp: number) {
		this.stats.hp = hp;
		this.stats.maxHp = hp;
	}

	setBaseShield(shield: number) {
		this.stats.shield = shield;
	}

	/* resetStatsFromMods() {

	} */

	addStatMod(mod: Mod<MOD.STAT>) {
		this.activeStatMods.push(mod);
		// TODO add mod to fixed modifiers
	}

	removeMod(originId: string) {
		/* const updatedStatMods = this.activeStatMods.filter((mod) => mod.originId !== originId);
		this.activeStatMods = updatedStatMods; */
		// TODO update fixed modifiers
	}

	setInitialUnitStats() {
		return {
			hp: 0,
			maxHp: 0,
			shield: 0,
		};
	}
}
