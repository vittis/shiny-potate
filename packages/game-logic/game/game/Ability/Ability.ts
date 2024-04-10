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
import {
	createDamageSubEvent,
	createDisableSubEvent,
	createHealSubEvent,
	createShieldSubEvent,
	createStatusEffectSubEvent,
} from "../Event/EventFactory";
import { getAllTargetUnits } from "../Target/TargetUtils";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";

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

		const onUseSubEvents = this.onUse(
			unit,
			this.data.effects.filter(effect => effect.trigger === TRIGGER.ON_USE),
		);

		const onHitSubEvents = this.onHit(
			unit,
			this.data.effects.filter(effect => effect.trigger === TRIGGER.ON_HIT),
		);

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
		let subEvents: SubEvent[] = [];

		effects.forEach(effect => {
			let newSubEvents: SubEvent[] = [];

			if (effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
				newSubEvents = createDamageSubEvent(unit, effect, this.getDamageModifier(unit));
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

	onHit(unit: Unit, effects: PossibleTriggerEffect[]) {
		let subEvents: SubEvent[] = [];

		effects.forEach(effect => {
			let newSubEvents: SubEvent[] = [];

			if (effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
				newSubEvents = createDamageSubEvent(unit, effect, this.getDamageModifier(unit));
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
}
