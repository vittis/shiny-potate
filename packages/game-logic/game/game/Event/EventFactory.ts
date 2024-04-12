import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { getAllTargetUnits } from "../Target/TargetUtils";
import { canUseEffect } from "../Trigger/ConditionUtils";
import {
	PossibleTriggerEffect,
	TRIGGER,
	TRIGGER_EFFECT_TYPE,
	TriggerEffect,
} from "../Trigger/TriggerTypes";
import { Unit } from "../Unit/Unit";
import {
	EVENT_TYPE,
	INSTANT_EFFECT_TYPE,
	SUBEVENT_TYPE,
	SubEvent,
	TICK_EFFECT_TYPE,
	TickEffectEvent,
} from "./EventTypes";

export function createStatusEffectSubEvent(
	unit: Unit,
	effect: TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>,
) {
	const targetUnits = unit.bm.getTarget(unit, effect.target);

	const subEvents = getAllTargetUnits(targetUnits).map(target => {
		const payloadStatusEffects = effect.payload.map(statusEffect => ({
			name: statusEffect.name,
			quantity: statusEffect.quantity,
		}));

		return {
			type: SUBEVENT_TYPE.INSTANT_EFFECT,
			payload: {
				type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
				targetId: target.id,
				payload: [...payloadStatusEffects],
			},
		} as SubEvent;
	});

	return subEvents;
}

export function createDisableSubEvent(
	unit: Unit,
	effect: TriggerEffect<TRIGGER_EFFECT_TYPE.DISABLE>,
) {
	const targetUnits = unit.bm.getTarget(unit, effect.target);

	const subEvents = getAllTargetUnits(targetUnits).map(target => {
		const payloadDisables = effect.payload.map(disable => ({
			name: disable.name,
			duration: disable.duration,
		}));

		return {
			type: SUBEVENT_TYPE.INSTANT_EFFECT,
			payload: {
				type: INSTANT_EFFECT_TYPE.DISABLE,
				targetId: target.id,
				payload: [...payloadDisables],
			},
		} as SubEvent;
	});

	return subEvents;
}

export function createHealSubEvent(unit: Unit, effect: TriggerEffect<TRIGGER_EFFECT_TYPE.HEAL>) {
	const targetUnits = unit.bm.getTarget(unit, effect.target);

	const subEvents = getAllTargetUnits(targetUnits).map(target => {
		return {
			type: SUBEVENT_TYPE.INSTANT_EFFECT,
			payload: {
				type: INSTANT_EFFECT_TYPE.HEAL,
				targetId: target.id,
				payload: {
					value: effect.payload.value,
				},
			},
		} as SubEvent;
	});

	return subEvents as SubEvent[];
}

export function createShieldSubEvent(
	unit: Unit,
	effect: TriggerEffect<TRIGGER_EFFECT_TYPE.SHIELD>,
) {
	const targetUnits = unit.bm.getTarget(unit, effect.target);

	const subEvents = getAllTargetUnits(targetUnits).map(target => {
		return {
			type: SUBEVENT_TYPE.INSTANT_EFFECT,
			payload: {
				type: INSTANT_EFFECT_TYPE.SHIELD,
				targetId: target.id,
				payload: {
					value: effect.payload.value,
				},
			},
		} as SubEvent;
	});

	return subEvents as SubEvent[];
}

export function createDamageSubEvent(
	unit: Unit,
	effect: TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>,
	damageModifier = 0,
) {
	const targetUnits = unit.bm.getTarget(unit, effect.target);
	const allTargets = getAllTargetUnits(targetUnits);

	const subEvents = allTargets.map(target => {
		const targetDamageReductionModifier = target.stats.damageReductionModifier;

		const finalModifier = damageModifier - targetDamageReductionModifier;

		const finalDamage = Math.max(
			0,
			Math.round(effect.payload.value + (effect.payload.value * finalModifier) / 100),
		);

		return {
			type: SUBEVENT_TYPE.INSTANT_EFFECT,
			payload: {
				type: INSTANT_EFFECT_TYPE.DAMAGE,
				targetId: target.id,
				payload: {
					value: finalDamage,
				},
			},
		} as SubEvent;
	});

	const thornSubEvents = allTargets
		.filter(target => target.statusEffectManager.hasStatusEffect(STATUS_EFFECT.THORN))
		.map(target => {
			const thornDamage = target.statusEffects.find(
				statusEffect => statusEffect.name === STATUS_EFFECT.THORN,
			)?.quantity as number;

			return {
				type: SUBEVENT_TYPE.INSTANT_EFFECT,
				payload: {
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					targetId: unit.id,
					payload: {
						value: thornDamage,
					},
				},
			} as SubEvent;
		});

	const tauntSubEvent =
		(targetUnits.mainTarget &&
			[targetUnits.mainTarget]
				.filter(target => target.statusEffectManager.hasStatusEffect(STATUS_EFFECT.TAUNT))
				.map(target => {
					return {
						type: SUBEVENT_TYPE.INSTANT_EFFECT,
						payload: {
							type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
							targetId: target.id,
							payload: [
								{
									name: STATUS_EFFECT.TAUNT,
									quantity: -1,
								},
							],
						},
					} as SubEvent;
				})) ||
		[];

	return [...subEvents, ...thornSubEvents, ...tauntSubEvent] as SubEvent[];
}

export function createTickEffectEvent(unit: Unit, effect: TICK_EFFECT_TYPE, value: number) {
	const tickEffectEvent = {
		type: EVENT_TYPE.TICK_EFFECT,
		actorId: unit.id,
		step: unit.currentStep,
		payload: {
			type: effect,
			targetId: unit.id,
			payload: {
				value,
				decrement: 1,
			},
		},
	};

	return tickEffectEvent as TickEffectEvent;
}

export function generateSubEvents(
	unit: Unit,
	effects: PossibleTriggerEffect[],
	damageModifier = 0,
): SubEvent[] {
	let subEvents: SubEvent[] = [];

	effects.forEach(effect => {
		let newSubEvents: SubEvent[] = [];

		if (effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
			newSubEvents = createDamageSubEvent(unit, effect, damageModifier);
		} else if (effect.type === TRIGGER_EFFECT_TYPE.HEAL) {
			newSubEvents = createHealSubEvent(unit, effect);
		} else if (effect.type === TRIGGER_EFFECT_TYPE.SHIELD) {
			newSubEvents = createShieldSubEvent(unit, effect);
		} else if (effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT) {
			newSubEvents = createStatusEffectSubEvent(unit, effect);
		} else if (effect.type === TRIGGER_EFFECT_TYPE.DISABLE) {
			newSubEvents = createDisableSubEvent(unit, effect);
		}

		subEvents = [...subEvents, ...newSubEvents];
	});

	return subEvents;
}

export function createOnHitTakenSubEvents(unit: Unit, onHitSubEvents: SubEvent[]): SubEvent[] {
	let subEvents: SubEvent[] = [];

	const unitsWithDamageSubEvents: string[] = onHitSubEvents
		.filter(onHitSubEvent => onHitSubEvent.payload.type === INSTANT_EFFECT_TYPE.DAMAGE)
		.map(onHitSubEvent => onHitSubEvent.payload.targetId) as string[];
	const unitsThatTookHit: string[] = unitsWithDamageSubEvents.filter(
		(unitId, index) => unitsWithDamageSubEvents.indexOf(unitId) === index,
	);

	unitsThatTookHit.forEach(unitId => {
		const unitHit = unit.bm.getUnitById(unitId);
		const onHitTakenEffects = [
			...unitHit.triggerManager.getAllEffectsForTrigger(TRIGGER.ON_HIT_TAKEN),
		]
			.map(effect => effect.effect)
			.filter(effect => canUseEffect(effect, unitHit, unitHit.bm));

		const onHitTakenSubEvents = generateSubEvents(unitHit, onHitTakenEffects);

		subEvents = [...subEvents, ...onHitTakenSubEvents];
	});

	return subEvents;
}
