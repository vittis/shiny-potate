import { BoardManager } from "../BoardManager";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import {
	DamagePayload,
	DisablePayload,
	EVENT_TYPE,
	Effects,
	HealPayload,
	INSTANT_EFFECT_TYPE,
	PossibleEffects,
	PossibleEvent,
	SUBEVENT_TYPE,
	ShieldPayload,
	StatusEffectPayload,
	StepEffects,
	SubEvent,
	TickEffectEventPayload,
	UnitEffects,
} from "./EventTypes";

export function sortEventsByType(events: PossibleEvent[]) {
	return events.sort((a, b) => {
		const order = {
			[EVENT_TYPE.TICK_EFFECT]: 1,
			[EVENT_TYPE.USE_ABILITY]: 2,
			[EVENT_TYPE.TRIGGER_EFFECT]: 3,
			[EVENT_TYPE.FAINT]: 4,
		};

		return order[a.type] - order[b.type];
	});
}

function executeStepEvents(bm: BoardManager, events: PossibleEvent[]) {
	events.forEach(event => {
		bm.getUnitById(event.actorId).applyEvent(event);
	});

	return events;
}

/* 
	need to still return this for eventHistory but not execute
	create new function to execute events in new system
*/
export function sortAndExecuteEvents(bm: BoardManager, events: PossibleEvent[]) {
	// keep only sort function to return events
	//return sortEventsByType(events);

	return executeStepEvents(bm, sortEventsByType(events));
}

export function getAndExecuteDeathEvents(bm: BoardManager) {
	let events: PossibleEvent[] = [];
	bm.getAllAliveUnits().forEach(unit => {
		if (!unit.isDead && unit.hasDied()) {
			unit.onDeath();

			// execute events from death related triggers
			bm.getAllUnits().forEach(unit => {
				const triggerEvents: PossibleEvent[] = [];
				triggerEvents.push(...unit.serializeEvents());
				const orderedEvents = sortAndExecuteEvents(bm, triggerEvents);
				events.push(...orderedEvents);
			});
		}
	});

	return events;
}

export function getStepEffects(events: PossibleEvent[]): StepEffects {
	if (events.length === 0) return {} as StepEffects;

	let allSubEvents: SubEvent[] = [];

	events.forEach(event => {
		if (event.type === EVENT_TYPE.USE_ABILITY) {
			allSubEvents = [...allSubEvents, ...event.payload.subEvents];
		} else if (event.type === EVENT_TYPE.TRIGGER_EFFECT) {
			allSubEvents = [...allSubEvents, ...event.subEvents];
		} else if (event.type === EVENT_TYPE.TICK_EFFECT) {
			allSubEvents = [...allSubEvents, ...getSubEventsFromTickEffects(event.payload)];
		} else {
			console.log("getStepEffects: FAINT");
			console.log("FAINT will be generated after all subEvents for the step are calculated");
		}
	});

	const unitEffects: UnitEffects[] = [];

	allSubEvents.forEach(subEvent => {
		const unitId = subEvent.payload.targetId;
		const effect = {
			type: subEvent.payload.type,
			payload: subEvent.payload.payload,
		} as PossibleEffects;

		const existingUnitEffects = unitEffects.find(
			(unitEffects: UnitEffects) => unitEffects.unitId === unitId,
		);

		if (existingUnitEffects) {
			existingUnitEffects.effects.push(effect);
		} else {
			unitEffects.push({
				unitId,
				effects: [effect],
			});
		}
	});

	const calculateUnitEffects = unitEffects.map(unit => {
		return {
			unitId: unit.unitId,
			effects: calculateEffects(aggregateEffects(unit.effects)),
		};
	});

	const stepEffects: StepEffects = {
		step: events[0]?.step,
		units: calculateUnitEffects,
	};

	return stepEffects;
}

export function getSubEventsFromTickEffects(tickEffect: TickEffectEventPayload): SubEvent[] {
	if (tickEffect.type === "REGEN") {
		const healSubEvent = {
			type: SUBEVENT_TYPE.INSTANT_EFFECT,
			payload: {
				type: INSTANT_EFFECT_TYPE.HEAL,
				targetId: tickEffect.targetId,
				payload: {
					value: tickEffect.payload.value,
				},
			},
		} as SubEvent;

		const statusEffectSubEvent = {
			type: SUBEVENT_TYPE.INSTANT_EFFECT,
			payload: {
				type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
				targetId: tickEffect.targetId,
				payload: [{ name: STATUS_EFFECT.REGEN, quantity: tickEffect.payload.value }],
			},
		} as SubEvent;

		return [healSubEvent, statusEffectSubEvent];
	} /* if (tickEffect.type === "POISON") */ else {
		const damageSubEvent = {
			type: SUBEVENT_TYPE.INSTANT_EFFECT,
			payload: {
				type: INSTANT_EFFECT_TYPE.DAMAGE,
				targetId: tickEffect.targetId,
				payload: {
					value: tickEffect.payload.value,
				},
			},
		} as SubEvent;

		const statusEffectSubEvent = {
			type: SUBEVENT_TYPE.INSTANT_EFFECT,
			payload: {
				type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
				targetId: tickEffect.targetId,
				payload: [{ name: STATUS_EFFECT.POISON, quantity: tickEffect.payload.value }],
			},
		} as SubEvent;

		return [damageSubEvent, statusEffectSubEvent];
	}
}

export function aggregateEffects(effects: PossibleEffects[]): PossibleEffects[] {
	const aggregatedEffectsMap: Map<INSTANT_EFFECT_TYPE, PossibleEffects> = new Map();

	effects.forEach(effect => {
		const { type, payload } = effect;

		if (aggregatedEffectsMap.has(type)) {
			const existingEffect = aggregatedEffectsMap.get(type)!;
			if (
				type === INSTANT_EFFECT_TYPE.DAMAGE ||
				type === INSTANT_EFFECT_TYPE.HEAL ||
				type === INSTANT_EFFECT_TYPE.SHIELD
			) {
				const newValue =
					payload.value +
					(existingEffect.payload as DamagePayload | HealPayload | ShieldPayload).value;

				existingEffect.payload = { value: newValue };
			} else if (type === INSTANT_EFFECT_TYPE.STATUS_EFFECT) {
				let statusEffectsPayload = payload as StatusEffectPayload[];

				(existingEffect.payload as StatusEffectPayload[]).forEach(statusEffect => {
					const existingStatusEffect = statusEffectsPayload.find(
						payloadStatusEffect => payloadStatusEffect.name === statusEffect.name,
					);

					if (existingStatusEffect) {
						statusEffect.quantity += existingStatusEffect.quantity;

						statusEffectsPayload = statusEffectsPayload.filter(
							payloadStatusEffect => payloadStatusEffect.name !== statusEffect.name,
						);
					}
				});

				existingEffect.payload = [
					...(existingEffect.payload as StatusEffectPayload[]),
					...statusEffectsPayload,
				];
			} /* DISABLE */ else {
				let disablesPayload = payload as DisablePayload[];

				(existingEffect.payload as DisablePayload[]).forEach(disable => {
					const existingDisable = disablesPayload.find(
						payloadDisable => payloadDisable.name === disable.name,
					);

					if (existingDisable) {
						if (disable.duration > existingDisable.duration) {
							existingDisable.duration = disable.duration;
						}

						disablesPayload = disablesPayload.filter(
							payloadDisable => payloadDisable.name !== disable.name,
						);
					}
				});

				existingEffect.payload = [
					...(existingEffect.payload as DisablePayload[]),
					...disablesPayload,
				];
			}
		} else {
			// @ts-ignore
			aggregatedEffectsMap.set(type, { type, payload });
		}
	});

	return Array.from(aggregatedEffectsMap.values());
}

export function calculateEffects(effects: PossibleEffects[]): PossibleEffects[] {
	/* 
		Comparar dano com heal, pegar o maior e subtrair o outro
		Caso sobre dano, comparar com o valor do shield igualmente
		Status effect são apenas somados separadamente e disables pegam somente o maior valor -> já feitos no aggregateEffects
 	*/

	let damage =
		(
			effects.find(
				effect => effect.type === INSTANT_EFFECT_TYPE.DAMAGE,
			) as Effects<INSTANT_EFFECT_TYPE.DAMAGE>
		)?.payload.value || 0;
	let heal =
		(
			effects.find(
				effect => effect.type === INSTANT_EFFECT_TYPE.HEAL,
			) as Effects<INSTANT_EFFECT_TYPE.HEAL>
		)?.payload.value || 0;
	let shield =
		(
			effects.find(
				effect => effect.type === INSTANT_EFFECT_TYPE.SHIELD,
			) as Effects<INSTANT_EFFECT_TYPE.SHIELD>
		)?.payload.value || 0;

	if (damage && heal) {
		if (damage > heal) {
			damage -= heal;
			heal = 0;
		} else {
			heal -= damage;
			damage = 0;
		}
	}

	if (damage && shield) {
		if (damage > shield) {
			damage -= shield;
			shield = 0;
		} else {
			shield -= damage;
			damage = 0;
		}
	}

	const calculatedEffects: PossibleEffects[] = [];

	effects.forEach(effect => {
		if (effect.type === INSTANT_EFFECT_TYPE.DAMAGE) {
			if (damage > 0) calculatedEffects.push({ ...effect, payload: { value: damage } });
		} else if (effect.type === INSTANT_EFFECT_TYPE.HEAL) {
			if (heal > 0) calculatedEffects.push({ ...effect, payload: { value: heal } });
		} else if (effect.type === INSTANT_EFFECT_TYPE.SHIELD) {
			if (shield > 0) calculatedEffects.push({ ...effect, payload: { value: shield } });
		} else {
			return calculatedEffects.push(effect);
		}
	});

	return calculatedEffects;
}
