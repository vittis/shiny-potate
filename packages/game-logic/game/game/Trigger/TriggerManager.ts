import { BoardManager } from "../BoardManager";
import {
	createDamageSubEvent,
	createDisableSubEvent,
	createHealSubEvent,
	createShieldSubEvent,
	createStatusEffectSubEvent,
} from "../Event/EventFactory";
import { EVENT_TYPE, SubEvent, TriggerEffectEvent } from "../Event/EventTypes";
import { getSpecificPerkEffect } from "../Perk/PerkUtils";
import { Unit } from "../Unit/Unit";
import { canUseEffect } from "./ConditionUtils";
import {
	ActiveTriggerEffect,
	PossibleTriggerEffect,
	TRIGGER,
	TRIGGER_EFFECT_TYPE,
} from "./TriggerTypes";

export class TriggerManager {
	triggerEffects: ActiveTriggerEffect[] = [];

	constructor() {}

	addTriggerEffectsFromSource(effects: PossibleTriggerEffect[], sourceId: string) {
		effects.forEach(effect => {
			this.triggerEffects.push({ effect, sourceId });
		});
	}

	removeTriggerEffectsFromSource(sourceId: string) {
		this.triggerEffects = this.triggerEffects.filter(
			triggerEffect => triggerEffect.sourceId !== sourceId,
		);
	}

	getAllEffectsForTrigger(trigger: TRIGGER) {
		return this.triggerEffects.reduce((acc, activeEffect) => {
			if (activeEffect.effect.trigger === trigger) {
				acc.push(activeEffect);
			}
			return acc;
		}, [] as ActiveTriggerEffect[]);
	}

	onTrigger(trigger: TRIGGER, unit: Unit, bm: BoardManager) {
		const triggerEffects = this.getAllEffectsForTrigger(trigger);

		let subEvents: SubEvent[] = [];

		triggerEffects.forEach(triggerEffect => {
			let activeEffect = triggerEffect;

			if (!canUseEffect(activeEffect.effect, unit, bm)) {
				return;
			}

			if (activeEffect.effect.specific) {
				const perk = unit.perks.find(perk => perk.id === activeEffect.sourceId);
				if (!perk) {
					throw new Error(`onTrigger: Specific Perk not found: ${activeEffect.sourceId}`);
				}

				const effect = getSpecificPerkEffect(perk, unit)[0];
				if (!effect) return;

				activeEffect = {
					...activeEffect,
					effect,
				};
			}

			let newSubEvents: SubEvent[] = [];

			if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
				newSubEvents = createDamageSubEvent(
					unit,
					activeEffect.effect,
					0, // TODO serase 0 ou pega modifier de attack ou spell
				);
			} else if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.HEAL) {
				newSubEvents = createHealSubEvent(unit, activeEffect.effect);
			} else if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.SHIELD) {
				newSubEvents = createShieldSubEvent(unit, activeEffect.effect);
			} else if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT) {
				newSubEvents = createStatusEffectSubEvent(unit, activeEffect.effect);
			} else if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.DISABLE) {
				newSubEvents = createDisableSubEvent(unit, activeEffect.effect);
			}

			newSubEvents = newSubEvents.map(subEvent => {
				return {
					...subEvent,
					sourceId: activeEffect.sourceId,
				};
			});

			subEvents = [...subEvents, ...newSubEvents];
		});

		if (subEvents.length > 0) {
			const event: TriggerEffectEvent = {
				actorId: unit.id,
				step: unit.currentStep,
				type: EVENT_TYPE.TRIGGER_EFFECT,
				trigger: trigger,
				subEvents,
			};

			unit.stepIntents.push(event);
		}
	}
}
