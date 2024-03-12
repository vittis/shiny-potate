import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { ActiveStatusEffect, STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { STAT, UnitStats } from "./StatsTypes";

type StatsFromMods = Omit<UnitStats, "hp">;
type StatsFromStatusEffects = Omit<UnitStats, "hp" | "shield" | "maxHp">;

export class StatsManager {
	private stats!: UnitStats;
	private statsFromMods!: StatsFromMods;
	private activeMods: Mod<MOD_TYPE.GRANT_BASE_STAT>[] = [];
	private statsFromStatusEffects!: StatsFromStatusEffects;

	constructor() {
		this.resetStatsFromMods();
		this.resetStatsFromStatusEffects();
	}

	initializeStats(stats: UnitStats) {
		this.stats = stats;
	}

	setBaseHp(hp: number) {
		this.stats.hp = hp;
		this.stats.maxHp = hp;
	}

	// todo better stats management. better merge from all sources
	getStats(): UnitStats {
		return {
			maxHp: this.stats.maxHp + this.statsFromMods.maxHp,
			hp: this.stats.hp,
			shield: this.stats.shield + this.statsFromMods.shield,
			attackDamageModifier:
				this.statsFromMods.attackDamageModifier + this.statsFromStatusEffects.attackDamageModifier,
			attackCooldownModifier:
				this.statsFromStatusEffects.attackCooldownModifier +
				this.statsFromMods.attackCooldownModifier,
			spellDamageModifier:
				this.statsFromMods.spellDamageModifier + this.statsFromStatusEffects.spellDamageModifier,
			spellCooldownModifier:
				this.statsFromMods.spellCooldownModifier +
				this.statsFromStatusEffects.spellCooldownModifier,
			damageReductionModifier:
				this.statsFromMods.damageReductionModifier +
				this.statsFromStatusEffects.damageReductionModifier,
		};
	}

	setStats(newStats: UnitStats) {
		return (this.stats = newStats);
	}

	getStatsFromMods() {
		return this.statsFromMods;
	}

	getStatsFromStatusEffects() {
		return this.statsFromStatusEffects;
	}

	recalculateStatsFromStatusEffects(activeStatusEffects: ActiveStatusEffect[]) {
		this.resetStatsFromStatusEffects();

		activeStatusEffects.forEach(statusEffect => {
			switch (statusEffect.name) {
				case STATUS_EFFECT.ATTACK_POWER:
					this.statsFromStatusEffects.attackDamageModifier = statusEffect.quantity;
					break;
				case STATUS_EFFECT.SPELL_POTENCY:
					this.statsFromStatusEffects.spellDamageModifier = statusEffect.quantity;
					break;
				case STATUS_EFFECT.FAST:
					this.statsFromStatusEffects.attackCooldownModifier += statusEffect.quantity;
					break;
				case STATUS_EFFECT.FOCUS:
					this.statsFromStatusEffects.spellCooldownModifier += statusEffect.quantity;
					break;
				case STATUS_EFFECT.SLOW:
					this.statsFromStatusEffects.attackCooldownModifier -= statusEffect.quantity;
					this.statsFromStatusEffects.spellCooldownModifier -= statusEffect.quantity;
					break;
				case STATUS_EFFECT.STURDY:
					this.statsFromStatusEffects.damageReductionModifier += statusEffect.quantity;
					break;
				case STATUS_EFFECT.VULNERABLE:
					this.statsFromStatusEffects.damageReductionModifier -= statusEffect.quantity;
					break;
			}
		});
	}

	getActiveMods() {
		return this.activeMods;
	}

	resetStatsFromStatusEffects() {
		this.statsFromStatusEffects = {
			attackCooldownModifier: 0,
			attackDamageModifier: 0,
			spellCooldownModifier: 0,
			spellDamageModifier: 0,
			damageReductionModifier: 0,
		};
	}

	resetStatsFromMods() {
		this.statsFromMods = {
			maxHp: 0,
			attackCooldownModifier: 0,
			attackDamageModifier: 0,
			spellCooldownModifier: 0,
			spellDamageModifier: 0,
			damageReductionModifier: 0,
			shield: 0,
		};
	}

	addMods(mods: Mod<MOD_TYPE.GRANT_BASE_STAT>[]) {
		this.activeMods = [...this.activeMods, ...mods];
		this.applyModsToStats(this.activeMods);
	}

	removeMods(mods: Mod<MOD_TYPE.GRANT_BASE_STAT>[]) {
		this.activeMods = this.activeMods.filter(activeMod => !mods.includes(activeMod));
		this.applyModsToStats(this.activeMods);
	}

	applyModsToStats(mods: Mod<MOD_TYPE.GRANT_BASE_STAT>[]) {
		this.resetStatsFromMods();

		mods.forEach(mod => {
			const { stat, value } = mod.payload;
			switch (stat) {
				case STAT.HEALTH:
					this.statsFromMods.maxHp += value;
					break;
				case STAT.ATTACK_COOLDOWN:
					this.statsFromMods.attackCooldownModifier += value;
					break;
				case STAT.ATTACK_DAMAGE:
					this.statsFromMods.attackDamageModifier += value;
					break;
				case STAT.SPELL_COOLDOWN:
					this.statsFromMods.spellCooldownModifier += value;
					break;
				case STAT.SPELL_DAMAGE:
					this.statsFromMods.spellDamageModifier += value;
					break;
				case STAT.DAMAGE_REDUCTION:
					this.statsFromMods.damageReductionModifier += value;
					break;
			}
		});
	}
}
