import { MOD, Mod } from "../Mod/ModTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { StatEffectModifier, StatEffects, UnitStats } from "./StatsTypes";

/* 
	TODO: ver disc como fazer sistema de stats
 */

export class StatsManager {
	stats: UnitStats;
	statEffectModifiers: StatEffectModifier[];
	activeStatMods: Mod<MOD.STAT>[];
	//private statsFromStatusEffects!: StatsFromStatusEffects;

	constructor() {
		this.stats = this.setInitialStats();
		this.statEffectModifiers = [];
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

	/* getStatsFromMods() {
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
	} */

	/* resetStatsFromStatusEffects() {
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
	} */

	addStatMod(mod: Mod<MOD.STAT>) {
		this.activeStatMods.push(mod);
		//this.applyModsToStats(this.activeMods);
	}

	// todo: maybe set origin to mod to be able to remove it later
	/* removeMod(mod: Mod<MOD_TYPE.GRANT_BASE_STAT>[]) {
		this.activeMods = this.activeMods.filter(activeMod => !mods.includes(activeMod));
		this.applyModsToStats(this.activeMods);
	} */

	setInitialStats() {
		return {
			maxHp: 0,
			hp: 0,
			shield: 0,
			statEffects: Object.fromEntries(
				[
					"COOLDOWN",
					"HP",
					"DAMAGE",
					"HEAL",
					"GAIN_HEAL",
					"SHIELD",
					"GAIN_SHIELD",
					...Object.keys(STATUS_EFFECT),
				].map(effect => [effect, { FLAT: 0, PERCENTAGE: 100 }]),
			) as StatEffects,
		};
	}
}
