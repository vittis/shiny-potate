import { Mod, MOD } from "@/game/Mod/ModTypes";
import { PackUnit } from "@/game/PackUnit/PackUnit";
import { StatModifier, StatModifierType, UnitStats } from "@/game/Stats/StatsTypes";
import { convertStatModToStatModifier } from "@/game/Stats/StatsUtils";
import { STATUS_EFFECT } from "@/game/StatusEffect/StatusEffectTypes";
import { TAG } from "@/game/Tag/TagTypes";

export class StatsManager {
	baseStats: UnitStats;
	stats: UnitStats;
	statMods: Mod<MOD.STAT>[];
	activeStatModifiers: StatModifier[];
	unitTags: TAG[];
	//private statsFromStatusEffects!: StatsFromStatusEffects;

	constructor(packUnit: PackUnit) {
		this.baseStats = {
			hp: packUnit.hp,
			maxHp: packUnit.hp,
			shield: 0,
		};
		this.stats = this.baseStats;
		this.unitTags = packUnit.tags;

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
		const validStatMods = statMods.filter(mod => !mod.triggers.length);
		this.statMods.push(...validStatMods);
		this.activateStatMods();
	}

	removeStatModsFromOrigin(sourceId: string) {
		const updatedActiveStatMods = this.statMods.filter(mod => mod.sourceId !== sourceId);
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
		const updatedHp = this.getValueWithStatModifiers(
			this.baseStats.maxHp,
			this.unitTags,
			"HP_MODIFIER",
		);
		const updatedShield = this.getValueWithStatModifiers(
			this.baseStats.shield,
			this.unitTags,
			"SHIELD_MODIFIER",
		);

		this.stats = {
			hp: updatedHp,
			maxHp: updatedHp,
			shield: updatedShield,
		};
	}

	getValueWithStatModifiers(
		value: number,
		tags: TAG[],
		type: StatModifierType,
		statusEffect?: STATUS_EFFECT,
	): number {
		const typeModifiers = this.activeStatModifiers.filter(
			mod =>
				mod.type === type &&
				(mod.type !== "STATUS_EFFECT_MODIFIER" || mod.statusEffect === statusEffect),
		);

		const typeModifiersFilteredByTags = typeModifiers.filter(
			mod => mod.tags.length == 0 || mod.tags.some(tag => tags.includes(tag)),
		);

		const flatModifiers = typeModifiersFilteredByTags.filter(mod => mod.category === "FLAT");
		const percentageModifiers = typeModifiersFilteredByTags.filter(
			mod => mod.category === "PERCENTAGE",
		);
		const multiplicativeModifiers = typeModifiersFilteredByTags.filter(
			mod => mod.category === "MULTIPLICATIVE",
		);

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
