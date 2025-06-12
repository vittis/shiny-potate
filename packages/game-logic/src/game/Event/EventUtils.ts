import { BoardManager } from "@/game/BoardManager/BoardManager";
import { EVENT_TYPE, PossibleEvent, PossibleIntent, StepEffects, SubEvent, UnitEffects, UseAbilityEvent } from "@/game/Event/EventTypes";
import { INSTANT_EFFECT, ModEffectPayload } from "@/game/Mod/ModTypes";

export function getEventsFromIntents(bm: BoardManager, intents: PossibleIntent[]): PossibleEvent[] {
	const events: PossibleEvent[] = intents.map(intent => {
		/* if (intent.type === EVENT_TYPE.USE_ABILITY) { */
		const unit = bm.getUnitById(intent.actorId);

		const ability = unit.abilities.find(ability => ability.id === intent.id);
		if (!ability) throw Error("getEventsFromIntents: Ability not found on use ability intent");

		const useAbilityEvent = ability.use(unit, bm) as UseAbilityEvent;

		return useAbilityEvent;
		/* } */
	});

	return events;
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
		} /* else if (event.type === EVENT_TYPE.TRIGGER_EFFECT) {
			allSubEvents = [...allSubEvents, ...event.subEvents];
		} else if (event.type === EVENT_TYPE.TICK_EFFECT) {
			allSubEvents = [...allSubEvents, ...getSubEventsFromTickEffects(event.payload)];
		} else if (event.type === EVENT_TYPE.FAINT) {
			deadUnits.push(event.actorId);
		} */
	});

	const unitEffects: UnitEffects[] = [];

	allSubEvents.forEach(subEvent => {
		const unitId = subEvent.targetsId[0]; // todo pode ser mais de um target
		const effect = subEvent.payload;

		const existingUnitEffects = unitEffects.find((unitEffects: UnitEffects) => unitEffects.unitId === unitId);

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

export function aggregateEffects(effects: ModEffectPayload[]): ModEffectPayload[] {
	const aggregatedEffectsMap: Map<string, ModEffectPayload> = new Map();

	effects.forEach(payload => {
		const { effect, value } = payload;

		// Create a unique key for the map
		let key: string;
		if (effect === INSTANT_EFFECT.STATUS_EFFECT) {
			// For STATUS_EFFECT, include the statusEffect in the key
			key = `${effect}_${payload.statusEffect}`;
		} else {
			// For other effects, just use the effect name
			key = effect;
		}

		if (aggregatedEffectsMap.has(key)) {
			// If the effect already exists, add the values
			const existingEffect = aggregatedEffectsMap.get(key)!;
			existingEffect.value += value;
		} else {
			// If it's a new effect, add it to the map
			aggregatedEffectsMap.set(key, payload);
		}
	});

	return Array.from(aggregatedEffectsMap.values());
}

export function calculateEffects(effects: ModEffectPayload[]): ModEffectPayload[] {
	/* 
		Comparar dano com heal, pegar o maior e subtrair o outro
		Caso sobre dano, comparar com o valor do shield igualmente
		Status effect são apenas somados separadamente e disables pegam somente o maior valor -> já feitos no aggregateEffects
 	*/

	let damage = effects.find(effect => effect.effect === INSTANT_EFFECT.DAMAGE)?.value || 0;
	let heal = effects.find(effect => effect.effect === INSTANT_EFFECT.HEAL)?.value || 0;
	let shield = effects.find(effect => effect.effect === INSTANT_EFFECT.APPLY_SHIELD)?.value || 0;

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

	const calculatedEffects: ModEffectPayload[] = [];

	effects.forEach(effect => {
		if (effect.effect === INSTANT_EFFECT.DAMAGE) {
			if (damage > 0) calculatedEffects.push({ ...effect, value: damage });
		} else if (effect.effect === INSTANT_EFFECT.HEAL) {
			if (heal > 0) calculatedEffects.push({ ...effect, value: heal });
		} else if (effect.effect === INSTANT_EFFECT.APPLY_SHIELD) {
			if (shield > 0) calculatedEffects.push({ ...effect, value: shield });
		} else {
			return calculatedEffects.push(effect);
		}
	});

	return calculatedEffects;
}
