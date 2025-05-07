import { MOD, Mod } from "../Mod/ModTypes";
import { PackUnit } from "../PackUnit/PackUnit";
import { ModifierType, StatModifier, UnitStats } from "./StatsTypes";
import { convertStatModToStatModifier } from "./StatsUtils";

export class StatsManager {
	baseStats: UnitStats;
	stats: UnitStats;
	statMods: Mod<MOD.STAT>[];
	activeStatModifiers: StatModifier[];
	//private statsFromStatusEffects!: StatsFromStatusEffects;

	constructor(packUnit: PackUnit) {
		this.baseStats = {
			hp: packUnit.hp,
			maxHp: packUnit.hp,
			shield: 0,
		};
		this.stats = this.baseStats;

		this.statMods = packUnit.getStatMods();
		this.activeStatModifiers = [];
		this.activateStatMods();
		this.updateStats();
	}

	getStats(): UnitStats {
		return this.stats;
	}

	getStatMods(): Mod<MOD.STAT>[] {
		return this.statMods;
	}

	getActiveStatMods(): StatModifier[] {
		return this.activeStatModifiers;
	}

	setBaseStats(packUnit: PackUnit) {
		this.baseStats.hp = packUnit.hp;
		this.baseStats.maxHp = packUnit.hp;
		this.baseStats.shield = 0; // sera
	}

	addStatMods(statMods: Mod<MOD.STAT>[]) {
		this.statMods.push(...statMods);
		this.activateStatMods();
	}

	removeStatModsFromOrigin(originId: string) {
		const updatedActiveStatMods = this.statMods.filter(mod => mod.originId !== originId);
		this.statMods = updatedActiveStatMods;
		this.activateStatMods();
	}

	removeStatModsFromModId(modId: string) {
		const updatedActiveStatMods = this.statMods.filter(mod => mod.id !== modId);
		this.statMods = updatedActiveStatMods;
		this.activateStatMods();
	}

	activateStatMods() {
		this.activeStatModifiers = [];
		this.statMods.forEach(mod => {
			/* if (TODO: check if pass mod.conditions) */
			const statModifiers = convertStatModToStatModifier(mod);
			/* const validTargets = mod.targets.forEach(target => {
				if (TODO: check targets that pass filters)
				later push to activeStatModifiers on those targets
			}) */
			this.activeStatModifiers.push(...statModifiers);
		});
		this.updateStats();
	}

	updateStats() {
		const updatedHp = this.getValueWithStatModifiers(this.baseStats.maxHp, "HP_MODIFIER");
		const updatedShield = this.getValueWithStatModifiers(this.baseStats.shield, "SHIELD_MODIFIER");

		this.stats = {
			hp: updatedHp,
			maxHp: updatedHp,
			shield: updatedShield,
		};
	}

	getValueWithStatModifiers(value: number, type: ModifierType): number {
		const typeModifiers = this.activeStatModifiers.filter(mod => mod.type === type);

		const flatModifiers = typeModifiers.filter(mod => mod.category === "FLAT");
		const percentageModifiers = typeModifiers.filter(mod => mod.category === "PERCENTAGE");
		const multiplicativeModifiers = typeModifiers.filter(mod => mod.category === "MULTIPLICATIVE");

		const updateWithFlatModifiers = flatModifiers.reduce((acc, mod) => acc + mod.value, value);
		const updateWithPercentageModifiers = percentageModifiers.reduce(
			(acc, mod) => acc * (mod.value / 100 + 1),
			updateWithFlatModifiers,
		);
		const updateWithMultiplicativeModifiers = multiplicativeModifiers.reduce(
			(acc, mod) => acc * mod.value,
			updateWithPercentageModifiers,
		);

		return updateWithMultiplicativeModifiers;
	}
}
