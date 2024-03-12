import { UnitStats } from "../Stats/StatsTypes";
import { Ability } from "./Ability";
import { ABILITY_CATEGORY } from "./AbilityTypes";

interface ActiveAbility {
	ability: Ability;
	sourceId: string;
}

export class AbilityManager {
	private activeAbilities: ActiveAbility[] = [];

	constructor() {}

	get abilities() {
		return this.getAbilities();
	}

	removeAllAbiliiites() {
		this.activeAbilities = [];
	}

	addAbilitiesFromSource(abilities: Ability[], sourceId: string) {
		abilities.forEach(ability => {
			this.activeAbilities.push({ ability, sourceId });
		});
	}

	removeAbilitiesFromSource(sourceId: string) {
		this.activeAbilities = this.activeAbilities.filter(ability => ability.sourceId !== sourceId);
	}

	getAbilities() {
		return this.activeAbilities.map(ability => ability.ability);
	}

	applyCooldownModifierFromStats(stats: UnitStats) {
		this.activeAbilities.forEach(({ ability }) => {
			const isAttack = ability.data.type === ABILITY_CATEGORY.ATTACK;

			if (isAttack) {
				ability.modifyCooldown(stats.attackCooldownModifier);
			} else {
				ability.modifyCooldown(stats.spellCooldownModifier);
			}
		});
	}
}
