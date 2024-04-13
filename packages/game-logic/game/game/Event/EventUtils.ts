import { BoardManager } from "../BoardManager";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import {
	DamagePayload,
	DisablePayload,
	EVENT_TYPE,
	Effect,
	HealPayload,
	INSTANT_EFFECT_TYPE,
	PossibleEffect,
	PossibleEvent,
	PossibleIntent,
	SUBEVENT_TYPE,
	ShieldPayload,
	StatusEffectPayload,
	StepEffects,
	SubEvent,
	TickEffectEventPayload,
	UnitEffects,
	UseAbilityEvent,
} from "./EventTypes";

export function sortEventsByType(events: PossibleEvent[] | PossibleIntent[]) {
	return events.sort((a, b) => {
		const order = {
			[EVENT_TYPE.TICK_EFFECT]: 1,
			[EVENT_TYPE.FAINT]: 2,
			[EVENT_TYPE.TRIGGER_EFFECT]: 3,
			[EVENT_TYPE.USE_ABILITY]: 4,
		};

		return order[a.type] - order[b.type];
	});
}

export function getEventsFromIntents(bm: BoardManager, intents: PossibleIntent[]): PossibleEvent[] {
	const events: PossibleEvent[] = intents.map(intent => {
		if (intent.type === EVENT_TYPE.USE_ABILITY) {
			const unit = bm.getUnitById(intent.actorId);

			const ability = unit.abilities.find(ability => ability.id === intent.id);
			if (!ability) throw Error("getEventsFromIntents: Ability not found on use ability intent");

			const useAbilityEvent = ability.use(unit, intent.useMultistrike) as UseAbilityEvent;

			return useAbilityEvent;
		} else {
			return intent;
		}
	});

	// FIX: deal with abilities with no target having no event
	return events.filter(event => event !== undefined) as PossibleEvent[];
}

export function getDeathIntents(bm: BoardManager): Map<string, PossibleIntent[]> {
	const deathIntentsMap: Map<string, PossibleIntent[]> = new Map();

	bm.getAllAliveUnits().forEach(unit => {
		if (!unit.isDead && unit.hasDied()) {
			unit.onDeath();

			// get intents from death related triggers
			bm.getAllUnits().forEach(unit => {
				deathIntentsMap.set(unit.id, [
					...(deathIntentsMap.get(unit.id) || []),
					...unit.serializeIntents(),
				]);
			});
		}
	});

	return deathIntentsMap;
}

export function executeStepEffects(bm: BoardManager, stepEffects: StepEffects) {
	stepEffects.units.forEach(unit => {
		unit.effects.forEach(effect => {
			bm.getUnitById(unit.unitId).applyEffect(effect);
		});
	});
}

export function getStepEffects(events: PossibleEvent[]): StepEffects {
	if (events.length === 0) return {} as StepEffects;

	let allSubEvents: SubEvent[] = [];
	const deadUnits: string[] = [];

	events.forEach(event => {
		if (event.type === EVENT_TYPE.USE_ABILITY) {
			allSubEvents = [...allSubEvents, ...event.payload.subEvents];
		} else if (event.type === EVENT_TYPE.TRIGGER_EFFECT) {
			allSubEvents = [...allSubEvents, ...event.subEvents];
		} else if (event.type === EVENT_TYPE.TICK_EFFECT) {
			allSubEvents = [...allSubEvents, ...getSubEventsFromTickEffects(event.payload)];
		} else if (event.type === EVENT_TYPE.FAINT) {
			deadUnits.push(event.actorId);
		}
	});

	const unitEffects: UnitEffects[] = [];

	allSubEvents.forEach(subEvent => {
		const unitId = subEvent.payload.targetId;
		const effect = {
			type: subEvent.payload.type,
			payload: subEvent.payload.payload,
		} as PossibleEffect;

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
		...(deadUnits.length > 0 && { deadUnits }),
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
				payload: [{ name: STATUS_EFFECT.REGEN, quantity: tickEffect.payload.decrement * -1 }],
			},
		} as SubEvent;

		return [healSubEvent, statusEffectSubEvent];
	} else if (tickEffect.type === "POISON") {
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
				payload: [{ name: STATUS_EFFECT.POISON, quantity: tickEffect.payload.decrement * -1 }],
			},
		} as SubEvent;

		return [damageSubEvent, statusEffectSubEvent];
	}

	throw Error("getSubEventsFromTickEffects: Invalid tick effect type - " + tickEffect.type);
}

export function aggregateEffects(effects: PossibleEffect[]): PossibleEffect[] {
	const aggregatedEffectsMap: Map<INSTANT_EFFECT_TYPE, PossibleEffect> = new Map();

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

export function calculateEffects(effects: PossibleEffect[]): PossibleEffect[] {
	/* 
		Comparar dano com heal, pegar o maior e subtrair o outro
		Caso sobre dano, comparar com o valor do shield igualmente
		Status effect são apenas somados separadamente e disables pegam somente o maior valor -> já feitos no aggregateEffects
 	*/

	let damage =
		(
			effects.find(
				effect => effect.type === INSTANT_EFFECT_TYPE.DAMAGE,
			) as Effect<INSTANT_EFFECT_TYPE.DAMAGE>
		)?.payload.value || 0;
	let heal =
		(
			effects.find(
				effect => effect.type === INSTANT_EFFECT_TYPE.HEAL,
			) as Effect<INSTANT_EFFECT_TYPE.HEAL>
		)?.payload.value || 0;
	let shield =
		(
			effects.find(
				effect => effect.type === INSTANT_EFFECT_TYPE.SHIELD,
			) as Effect<INSTANT_EFFECT_TYPE.SHIELD>
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

	const calculatedEffects: PossibleEffect[] = [];

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

// only for testing
export function applyEvents(bm: BoardManager, events: PossibleEvent[]) {
	executeStepEffects(bm, getStepEffects(events));
}
