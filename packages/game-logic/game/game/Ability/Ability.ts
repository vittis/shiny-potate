import { ABILITY_CATEGORY, AbilityData } from "./AbilityTypes";
import { AbilityDataSchema } from "./AbilitySchema";
import { Unit } from "../Unit/Unit";
import {
	EVENT_TYPE,
	UseAbilityEvent,
	SubEvent,
	SUBEVENT_TYPE,
	INSTANT_EFFECT_TYPE,
} from "../Event/EventTypes";
import { PossibleTriggerEffect, TRIGGER, TRIGGER_EFFECT_TYPE } from "../Trigger/TriggerTypes";
import { nanoid } from "nanoid";
import { createOnHitTakenSubEvents, generateSubEvents } from "../Event/EventFactory";
import { getAllTargetUnits } from "../Target/TargetUtils";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { canUseEffect } from "../Trigger/ConditionUtils";

export class Ability {
	id: string;
	data: AbilityData;
	progress = 0;
	cooldown = 0;

	constructor(data?: AbilityData) {
		if (!data) {
			throw Error(
				"Ability is undefined. If running from test make sure it's defined in mock files",
			);
		}
		const parsedData = AbilityDataSchema.parse(data);
		this.data = parsedData;
		this.cooldown = parsedData.cooldown;
		this.id = nanoid(8);
	}

	step() {
		this.progress += 1;
	}

	modifyCooldown(value: number) {
		this.cooldown = Math.round(this.data.cooldown - this.data.cooldown * (value / 100));
	}

	canActivate() {
		return this.progress >= this.cooldown;
	}

	use(unit: Unit, useMultistrike: boolean = false): UseAbilityEvent {
		const targetUnits = this.getTargets(unit);

		// TODO fix abilities with no target
		if (getAllTargetUnits(targetUnits).length == 0) {
			this.progress = 0;
			//@ts-expect-error
			return;
		}

		const onUseAbilityEffects = this.data.effects.filter(
			effect => effect.trigger === TRIGGER.ON_USE,
		);
		const onUsePerkEffects = [
			...unit.triggerManager.getAllEffectsForTrigger(TRIGGER.ON_USE),
			...unit.triggerManager.getAllEffectsForTrigger(
				this.isAttack() ? TRIGGER.ON_ATTACK_USE : TRIGGER.ON_SPELL_USE,
			),
		]
			.map(effect => effect.effect)
			.filter(effect => canUseEffect(effect, unit, unit.bm));

		const onHitAbilityEffects = this.data.effects.filter(
			effect => effect.trigger === TRIGGER.ON_HIT,
		);
		const onHitPerkEffects = [
			...unit.triggerManager.getAllEffectsForTrigger(TRIGGER.ON_HIT),
			...unit.triggerManager.getAllEffectsForTrigger(
				this.isAttack() ? TRIGGER.ON_ATTACK_HIT : TRIGGER.ON_SPELL_HIT,
			),
		]
			.map(effect => {
				let triggerEffect = effect.effect;

				if (effect.effect.target === TARGET_TYPE.HIT_TARGET) {
					triggerEffect.target = this.data.target;
				}

				return triggerEffect;
			})
			.filter(effect => canUseEffect(effect, unit, unit.bm));

		const onUseSubEvents = this.onUse(unit, [...onUseAbilityEffects, ...onUsePerkEffects]);
		const onHitSubEvents = this.onHit(unit, [...onHitAbilityEffects, ...onHitPerkEffects]);

		const abilitySubEvents = [...onUseSubEvents, ...onHitSubEvents];

		const multistrikeSubEvent = {
			type: SUBEVENT_TYPE.INSTANT_EFFECT,
			payload: {
				type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
				targetId: unit.id,
				payload: [
					{
						name: STATUS_EFFECT.MULTISTRIKE,
						quantity: -1,
					},
				],
			},
		} as SubEvent;
		if (useMultistrike) abilitySubEvents.push(multistrikeSubEvent);

		const useAbilityEvent: UseAbilityEvent = {
			type: EVENT_TYPE.USE_ABILITY,
			actorId: unit.id,
			step: unit.currentStep,
			payload: {
				id: this.id,
				name: this.data.name,
				targetsId: getAllTargetUnits(targetUnits).map(t => t?.id), //TODO replace with main and secondary targetsId
				subEvents: abilitySubEvents,
			},
		};

		this.progress = 0;
		return useAbilityEvent;
	}

	isAttack() {
		return this.data.type === ABILITY_CATEGORY.ATTACK;
	}

	isSpell() {
		return this.data.type === ABILITY_CATEGORY.SPELL;
	}

	getDamageModifier(unit: Unit) {
		if (this.isAttack()) {
			return unit.stats.attackDamageModifier;
		} else {
			return unit.stats.spellDamageModifier;
		}
	}

	getTargets(unit: Unit) {
		const targetUnits = unit.bm.getTarget(unit, this.data.target);

		if (getAllTargetUnits(targetUnits).length == 0) {
			console.log(`Couldnt find target for ${this.data.name}`);
		}

		return targetUnits;
	}

	onUse(unit: Unit, effects: PossibleTriggerEffect[]) {
		const subEvents: SubEvent[] = generateSubEvents(unit, effects, this.getDamageModifier(unit));

		return subEvents;
	}

	onHit(unit: Unit, effects: PossibleTriggerEffect[]) {
		const onHitSubEvents: SubEvent[] = generateSubEvents(
			unit,
			effects,
			this.getDamageModifier(unit),
		);
		const onHitTakenSubEvents: SubEvent[] = createOnHitTakenSubEvents(unit, onHitSubEvents);

		const subEvents = [...onHitSubEvents, ...onHitTakenSubEvents];

		return subEvents;
	}
}
