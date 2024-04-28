import {
	ABILITY_CATEGORY,
	ABILITY_MOD_TYPES,
	AbilityData,
	AbilityModifierMod,
	AbilityModifierPossibleEffectMods,
	AbilityModifierWithEffects,
} from "./AbilityTypes";
import { Unit } from "../Unit/Unit";
import {
	EVENT_TYPE,
	UseAbilityEvent,
	SubEvent,
	SUBEVENT_TYPE,
	INSTANT_EFFECT_TYPE,
	UseAbilityIntent,
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
	triggers: TRIGGER[] = [];
	effects: PossibleTriggerEffect[] = [];
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
		this.triggers = data.triggers || [];
		this.effects = data.effects;
		this.target = data.target;
		this.type = data.type;
	}

	step() {
		if (this.cooldown !== 0) this.progress += 1;
	}

	modifyCooldown(modifier: number) {
		const progressRatio = this.progress / this.cooldown;

		this.cooldown = Math.round(this.data.cooldown / (1 + modifier / 100));
		this.progress = Math.round(progressRatio * this.cooldown);
	}

	canActivate() {
		return this.cooldown !== 0 && this.progress >= this.cooldown;
	}

	use(unit: Unit, useMultistrike: boolean = false): UseAbilityEvent {
		const targetUnits = this.getTargets(unit);

		// TODO fix abilities with no target
		if (getAllTargetUnits(targetUnits).length == 0) {
			this.progress = 0;
			//@ts-expect-error
			return;
		}

		const onUseAbilityEffects = this.effects.filter(effect => effect.trigger === TRIGGER.ON_USE);
		const onUsePerkEffects = [
			...unit.triggerManager.getAllEffectsForTrigger(TRIGGER.ON_USE),
			...unit.triggerManager.getAllEffectsForTrigger(
				this.isAttack() ? TRIGGER.ON_ATTACK_USE : TRIGGER.ON_SPELL_USE,
			),
		]
			.map(effect => effect.effect)
			.filter(effect => canUseEffect(effect, unit, unit.bm));

		const onHitAbilityEffects = this.effects.filter(effect => effect.trigger === TRIGGER.ON_HIT);
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

		const modifiersEffects = this.modifiers.map(modifier => modifier.effects).flat();

		const onUseSubEvents = this.onUse(unit, [
			...onUseAbilityEffects,
			...onUsePerkEffects,
			...modifiersEffects,
		]);
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
			console.log(`getTargets: Couldnt find target for ${this.data.name}`);
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
		const modifier = this.data.abilityModifiers?.find(mod => mod.name === name);

		if (!modifier) {
			throw Error(`addModifier: modifier ${name} for ability ${this.data.name} not found`);
		}

		if (isUniqueAbilityModifier(modifier)) {
			// TODO: deal with unique modifiers
		} else {
			const effectModifiers = modifier.modifiers.filter(
				mod =>
					mod.type !== ABILITY_MOD_TYPES.TRIGGER &&
					mod.type !== ABILITY_MOD_TYPES.TARGET &&
					mod.type !== ABILITY_MOD_TYPES.CATEGORY,
			) as AbilityModifierPossibleEffectMods[];

			if (effectModifiers.length > 0) {
				const effects = getEffectsFromModifiers(effectModifiers);

				const modifierWithEffects = {
					name: modifier.name,
					modifiers: modifier.modifiers,
					effects,
				};

				this.modifiers = [...this.modifiers, modifierWithEffects];
			}

			const triggerModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.TRIGGER,
			) as AbilityModifierMod<ABILITY_MOD_TYPES.TRIGGER>[];

			if (triggerModifiers.length > 0) {
				this.triggers = [...this.triggers, ...triggerModifiers.map(mod => mod.payload.name)];
			}

			const targetModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.TARGET,
			) as AbilityModifierMod<ABILITY_MOD_TYPES.TARGET>[];

			if (targetModifiers.length > 0) {
				this.target = targetModifiers[0].payload.name;

				this.effects = this.effects.map(effect => {
					return { ...effect, target: this.target };
				});
			}

			const categoryModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.CATEGORY,
			) as AbilityModifierMod<ABILITY_MOD_TYPES.CATEGORY>[];

			if (categoryModifiers.length > 0) {
				this.type = categoryModifiers[0].payload.name;
			}

			const cooldownModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.COOLDOWN,
			) as AbilityModifierMod<ABILITY_MOD_TYPES.COOLDOWN>[];

			if (cooldownModifiers.length > 0) {
				this.cooldown = cooldownModifiers[0].payload.value;
			}
		}
	}

	removeModifier(name: string) {
		const modifier = this.data.abilityModifiers?.find(mod => mod.name === name);

		if (!modifier) {
			throw Error(`removeModifier: modifier ${name} for ability ${this.data.name} not found`);
		}

		if (isUniqueAbilityModifier(modifier)) {
			// TODO: deal with unique modifiers
		} else {
			const modifierIndex = this.modifiers.findIndex(mod => mod.name === name);
			this.modifiers.splice(modifierIndex, 1);

			const triggerModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.TRIGGER,
			) as AbilityModifierMod<ABILITY_MOD_TYPES.TRIGGER>[];

			if (triggerModifiers.length > 0) {
				this.triggers = this.triggers.filter(trigger =>
					triggerModifiers.some(triggerModifier => triggerModifier.payload.name !== trigger),
				);
			}

			const targetModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.TARGET,
			) as AbilityModifierMod<ABILITY_MOD_TYPES.TARGET>[];

			if (targetModifiers.length > 0) {
				this.target = this.data.target;

				this.effects = this.effects.map(effect => {
					return { ...effect, target: this.data.target };
				});
			}

			const categoryModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.CATEGORY,
			) as AbilityModifierMod<ABILITY_MOD_TYPES.CATEGORY>[];

			if (categoryModifiers.length > 0) {
				this.type = this.data.type;
			}

			const cooldownModifiers = modifier.modifiers.filter(
				mod => mod.type === ABILITY_MOD_TYPES.COOLDOWN,
			) as AbilityModifierMod<ABILITY_MOD_TYPES.COOLDOWN>[];

			if (cooldownModifiers.length > 0) {
				this.cooldown = this.data.cooldown;
			}
		}
	}

	createAbilityIntent(unit: Unit, useMultistrike: boolean = false): UseAbilityIntent {
		const abilityIntent = {
			actorId: unit.id,
			type: EVENT_TYPE.USE_ABILITY,
			id: this.id,
			useMultistrike,
		} as UseAbilityIntent;

		return abilityIntent;
	}
}
