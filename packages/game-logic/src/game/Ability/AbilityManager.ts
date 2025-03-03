import { Ability } from "./Ability";

type ActiveAbility = {
	ability: Ability;
	sourceId: string;
};

export class AbilityManager {
	private activeAbilities: ActiveAbility[] = [];

	constructor() {}

	get abilities(): Ability[] {
		return this.getAbilities();
	}

	getAbilities(): Ability[] {
		return this.activeAbilities.map(ability => ability.ability);
	}

	addAbilitiesFromSource(abilities: Ability[], sourceId: string) {
		abilities.forEach(ability => {
			this.activeAbilities.push({ ability, sourceId });
		});
	}

	removeAbilitiesFromSource(sourceId: string) {
		this.activeAbilities = this.activeAbilities.filter(ability => ability.sourceId !== sourceId);
	}

	applyCooldownModifierFromStats(cooldownModifierStats: any) {
		/* todo: implement this after implementing stats
		this.activeAbilities.forEach(({ ability }) => {
			ability.modifyCooldown();
		}); */
	}
}
