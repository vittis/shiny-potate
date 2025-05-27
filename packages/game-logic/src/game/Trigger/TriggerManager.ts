import { Ability } from "@/game/Ability/Ability";
import { BoardUnit } from "@/game/BoardUnit/BoardUnit";
import { convertInstantEffectToStatModifierType } from "@/game/Mod/ModsUtils";
import { INSTANT_EFFECT, Mod, MOD, PossibleMod } from "@/game/Mod/ModTypes";
import { PackUnit } from "@/game/PackUnit/PackUnit";
import { StatsManager } from "@/game/Stats/StatsManager";
import { getTagFromSourceId } from "@/game/Tag/TagUtils";
import { TriggerAbility } from "@/game/Trigger/TriggerTypes";
import { getTriggerAbilityFromAbility } from "@/game/Trigger/TriggerUtils";

export class TriggerManager {
	boardUnit: BoardUnit;

	triggerAbilities: TriggerAbility[]; // id and sourceId referencing ability with trigger

	triggerMods: (Mod<MOD.STAT> | Mod<MOD.EFFECT>)[]; // mods fixed based on tier
	triggerCurrentMods: (Mod<MOD.STAT> | Mod<MOD.EFFECT>)[]; // mods calculated with stats and status effects that change the values

	constructor(boardUnit: BoardUnit, packUnit: PackUnit, abilities: Ability[]) {
		this.boardUnit = boardUnit;

		this.triggerAbilities = abilities
			.filter(ability => !!ability.triggers.length)
			.map(getTriggerAbilityFromAbility);
		this.triggerMods = [
			...packUnit.getStatMods().filter(mod => !!mod.triggers.length),
			...packUnit.getEffectMods().filter(mod => !!mod.triggers.length),
		];
		this.triggerCurrentMods = this.triggerMods;
	}

	addTriggerAbilities(abilities: Ability[]) {
		const validTriggerAbilities = abilities
			.filter(
				ability =>
					!!ability.triggers.length &&
					!this.triggerAbilities.find(triggerAbility => triggerAbility.id === ability.id),
			)
			.map(getTriggerAbilityFromAbility);
		this.triggerAbilities.push(...validTriggerAbilities);
	}

	addTriggerMods(mods: PossibleMod[]) {
		const validTriggerStatMods = mods.filter(
			mod => !!mod.triggers.length && mod.type !== MOD.GAIN_ABILITY,
		) as (Mod<MOD.STAT> | Mod<MOD.EFFECT>)[];
		this.triggerMods.push(...validTriggerStatMods);
	}

	updateTriggerModsWithStats(statsManager: StatsManager) {
		this.triggerCurrentMods = this.triggerMods.map(mod => {
			if (mod.type === MOD.STAT) return mod;

			const updatedPayload = mod.payload.map(payload => ({
				...payload,
				value: statsManager.getValueWithStatModifiers(
					payload.value,
					getTagFromSourceId(this.boardUnit, mod.sourceId),
					convertInstantEffectToStatModifierType(payload.effect as INSTANT_EFFECT),
					payload.effect == INSTANT_EFFECT.STATUS_EFFECT ? payload.statusEffect : undefined,
				),
			}));

			const updatedMod = { ...mod, payload: updatedPayload };

			return updatedMod;
		});
	}

	removeTriggerModsFromOrigin(sourceId: string) {
		const updatedTriggerMods = this.triggerMods.filter(mod => mod.sourceId !== sourceId);
		this.triggerMods = updatedTriggerMods;
		const updatedTriggerAbilities = this.triggerAbilities.filter(
			ability => ability.sourceId !== sourceId,
		);
		this.triggerAbilities = updatedTriggerAbilities;
	}
}
