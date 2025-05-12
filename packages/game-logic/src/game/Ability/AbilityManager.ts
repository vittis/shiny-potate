import { convertInstantEffectToStatModifierType } from "../Mod/ModsUtils";
import { INSTANT_EFFECT, MOD } from "../Mod/ModTypes";
import { PackUnit } from "../PackUnit/PackUnit";
import { StatsManager } from "../Stats/StatsManager";
import { StatModifier } from "../Stats/StatsTypes";
import { Ability } from "./Ability";

export class AbilityManager {
	private activeAbilities: Ability[] = [];

	constructor(packUnit: PackUnit) {
		const abilities = packUnit.getAbilities();
		if (abilities) {
			this.addAbilities(abilities);
		}
	}

	get abilities(): Ability[] {
		return this.getAbilities();
	}

	getAbilities(): Ability[] {
		return this.activeAbilities;
	}

	addAbilities(abilities: Ability[]) {
		abilities.forEach(ability => {
			this.activeAbilities.push(ability);
		});
	}

	removeAbilitiesFromSource(sourceId: string) {
		this.activeAbilities = this.activeAbilities.filter(ability => ability.sourceId !== sourceId);
	}

	upgradeAbilitiesFromSource(sourceId: string) {
		const abilitiesToUpgrade = this.activeAbilities.filter(
			ability => ability.sourceId === sourceId,
		);
		abilitiesToUpgrade.forEach(ability => {
			ability.upgradeTier();
		});
	}

	isAbilityActive(abilityName: string): boolean {
		return this.activeAbilities.some(ability => ability.name === abilityName);
	}

	updateAbilitiesEffectsWithStats(statsManager: StatsManager) {
		this.activeAbilities.forEach(ability => {
			ability.currentEffects = ability.effects.map(effect => {
				if (effect.type === MOD.STAT) return effect;

				const updatedPayload = effect.payload.map(payload => ({
					...payload,
					value: statsManager.getValueWithStatModifiers(
						payload.value,
						ability.tags,
						convertInstantEffectToStatModifierType(payload.effect as INSTANT_EFFECT),
						payload.effect == INSTANT_EFFECT.STATUS_EFFECT ? payload.statusEffect : undefined,
					),
				}));

				const updatedEffect = { ...effect, payload: updatedPayload };

				return updatedEffect;
			});
		});
	}

	applyCooldownModifierFromStats(cooldownModifierStats: any) {
		/* todo: implement this after implementing stats
		this.activeAbilities.forEach(({ ability }) => {
			ability.modifyCooldown();
		}); */
	}
}
