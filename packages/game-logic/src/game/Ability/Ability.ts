import { AbilityData } from "@/game/Ability/AbilityTypes";
import { BattleUnit } from "@/game/BattleUnit/BattleUnit";
import { BoardManager } from "@/game/BoardManager/BoardManager";
import { Equipment } from "@/game/Equipment/Equipment";
import { generateSubEvents } from "@/game/Event/EventFactory";
import { EVENT_TYPE, UseAbilityEvent, UseAbilityIntent } from "@/game/Event/EventTypes";
import { convertModTemplateToMod } from "@/game/Mod/ModsUtils";
import { PossibleAbilityMod } from "@/game/Mod/ModTypes";
import { PackUnit } from "@/game/PackUnit/PackUnit";
import { TAG } from "@/game/Tag/TagTypes";
import { MAX_TIER, Tier } from "@/game/Tier/TierTypes";
import { TriggerWithFilters } from "@/game/Trigger/TriggerTypes";
import { nanoid } from "nanoid";

export class Ability {
	id: string;
	name: string;
	data: AbilityData;

	tier: Tier;
	tags: TAG[];

	currentCooldown: number; // cooldown calculated with stats and status effects that change the value
	cooldown: number; // cooldown fixed based on tier
	progress: number;

	currentEffects: PossibleAbilityMod[]; // effects calculated with stats and status effects that change the values
	effects: PossibleAbilityMod[]; // effects fixed based on tier

	triggers: TriggerWithFilters[];

	sourceId: string | null; // id of the source that created this ability, can be PackUnit or Equipment
	isLinkedToSource: boolean; // only when source is Equipment, if true means this ability is the equipment's ability

	constructor(data: AbilityData, tier: Tier = 1, source: PackUnit | Equipment | null = null) {
		if (!data) {
			throw Error("Ability: Ability is undefined. If running from test make sure it's defined in mock files");
		}

		this.id = nanoid(8);
		this.name = data.name;
		this.data = data;
		this.tags = [...data.tags, ...(source ? source.tags : [])];
		this.tier = tier;
		this.cooldown = data.cooldown[this.tier - 1] || 0;
		this.currentCooldown = this.cooldown;
		this.progress = 0;
		this.effects = data.effects
			.filter(mod => !mod.minimumTier || mod.minimumTier <= tier)
			.map(mod => convertModTemplateToMod(mod, tier, this.id)) as PossibleAbilityMod[];
		this.currentEffects = this.effects;
		this.triggers = data.triggers || [];
		this.sourceId = source ? source.id : null;
		this.isLinkedToSource = source instanceof Equipment && source.data?.ability == this.name;
	}

	step() {
		if (this.currentCooldown !== 0) this.progress += 1;
	}

	canActivate() {
		return this.currentCooldown !== 0 && this.progress >= this.currentCooldown;
	}

	modifyCooldown() {
		// TODO: implement
	}

	use(unit: BattleUnit, bm: BoardManager): UseAbilityEvent {
		// when ability hits: trigger ON HIT effects
		// trigger ON USE effects once - at beginning or end?

		const abilitySubEvents = generateSubEvents(unit, this.currentEffects, bm);

		const useAbilityEvent: UseAbilityEvent = {
			type: EVENT_TYPE.USE_ABILITY,
			actorId: unit.id,
			step: unit.currentStep,
			payload: {
				id: this.id,
				name: this.data.name,
				subEvents: abilitySubEvents,
			},
		};

		this.progress = 0;
		return useAbilityEvent;
	}

	getInstantEffectModifiers() {
		// TODO: implement this, generate new currentEffects based on effects and instantEffectModifiers
	}

	createAbilityIntent(unit: BattleUnit): UseAbilityIntent {
		return {
			actorId: unit.id,
			type: EVENT_TYPE.USE_ABILITY,
			id: this.id,
		};
	}

	canUpgradeTier() {
		return this.tier < MAX_TIER;
	}

	upgradeTier() {
		if (this.canUpgradeTier()) {
			this.tier += 1;

			this.cooldown = this.data.cooldown[this.tier - 1] || 0;
			this.currentCooldown = this.cooldown; // todo: create function to calculate new current cooldown

			this.effects = this.data.effects
				.filter(mod => !mod.minimumTier || mod.minimumTier <= this.tier)
				.map(mod => convertModTemplateToMod(mod, this.tier, this.id)) as PossibleAbilityMod[];
			this.currentEffects = this.effects;
			// after upgrading ability tier, always call AbilityManager function updateAbilitiesEffectsWithStats on unit to update currentEffects
		}
	}
}
