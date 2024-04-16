import {
	ABILITY_CATEGORY,
	ABILITY_MOD_TYPES,
	AbilityData,
	AbilityModifier,
	AbilityModifierWithEffects,
	UniqueAbilityModifier,
} from "./AbilityTypes";
import { Unit } from "../Unit/Unit";
import {
	EVENT_TYPE,
	UseAbilityEvent,
	SubEvent,
	SUBEVENT_TYPE,
	INSTANT_EFFECT_TYPE,
} from "../Event/EventTypes";
import { PossibleTriggerEffect, TRIGGER } from "../Trigger/TriggerTypes";
import { nanoid } from "nanoid";
import { createOnHitTakenSubEvents, generateSubEvents } from "../Event/EventFactory";
import { getAllTargetUnits } from "../Target/TargetUtils";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { canUseEffect } from "../Trigger/ConditionUtils";
import { getEffectsFromModifiers, isUniqueAbilityModifier } from "./AbilityUtils";

export class Ability {
	id: string;
	data: AbilityData;
	target: TARGET_TYPE;
	type: ABILITY_CATEGORY;
	progress = 0;
	cooldown = 0;
	modifiers: AbilityModifierWithEffects[] = [];

	constructor(data?: AbilityData) {
		if (!data) {
			throw Error(
				"Ability is undefined. If running from test make sure it's defined in mock files",
			);
		}
		// TODO: create schema
		/* const parsedData = AbilityDataSchema.parse(data); */
		this.data = data;
		this.id = nanoid(8);
		this.cooldown = data.cooldown;

		this.target = data.target;
		this.type = data.type;
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
		return this.type === ABILITY_CATEGORY.ATTACK;
	}

	isSpell() {
		return this.type === ABILITY_CATEGORY.SPELL;
	}

	getDamageModifier(unit: Unit) {
		if (this.isAttack()) {
			return unit.stats.attackDamageModifier;
		} else {
			return unit.stats.spellDamageModifier;
		}
	}

	getTargets(unit: Unit) {
		const targetUnits = unit.bm.getTarget(unit, this.target);

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

	addModifier(name: string) {
		const modifier = this.data.abilityModifier?.find(mod => mod.name === name);

		if (!modifier) {
			throw Error(`addModifier: modifier ${name} for ability ${this.data.name} not found`);
		}

		if (isUniqueAbilityModifier(modifier)) {
			// deal with unique modifiers
		} else {
			const effects = getEffectsFromModifiers(
				modifier.modifiers.filter(
					mod =>
						mod.type !== ABILITY_MOD_TYPES.TRIGGER &&
						mod.type !== ABILITY_MOD_TYPES.TARGET &&
						mod.type !== ABILITY_MOD_TYPES.CATEGORY,
				),
			);

			const modifierWithEffects = {
				name: modifier.name,
				modifiers: modifier.modifiers,
				effects,
			};

			this.modifiers.push(modifierWithEffects);

			const triggerModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.TRIGGER,
			);

			// todo: add trigger modifiers

			const targetModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.TARGET,
			);

			// todo: add target modifiers
			// change default target to new target, change default effects with default target to new target

			const categoryModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.CATEGORY,
			);

			// todo: add category modifiers
			// change category to new category
		}
	}

	removeModifier(name: string) {
		const modifier = this.modifiers.findIndex(mod => mod.name === name);

		if (modifier === -1) {
			throw Error(`removeModifier: modifier ${name} for ability ${this.data.name} not found`);
		}

		this.modifiers.splice(modifier, 1);
	}
}
