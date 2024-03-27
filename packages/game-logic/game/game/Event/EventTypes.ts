import { DISABLE } from "../Disable/DisableTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TRIGGER } from "../Trigger/TriggerTypes";

export enum EVENT_TYPE {
	USE_ABILITY = "USE_ABILITY",
	FAINT = "FAINT",
	TRIGGER_EFFECT = "TRIGGER_EFFECT",
	TICK_EFFECT = "TICK_EFFECT",
}

export enum SUBEVENT_TYPE {
	INSTANT_EFFECT = "INSTANT_EFFECT",
}

export enum INSTANT_EFFECT_TYPE {
	DAMAGE = "DAMAGE",
	HEAL = "HEAL",
	SHIELD = "SHIELD",
	DISABLE = "DISABLE",
	STATUS_EFFECT = "STATUS_EFFECT",
}

export enum TICK_EFFECT_TYPE {
	REGEN = "REGEN",
	POISON = "POISON",
}

export type PossibleEvent = UseAbilityEvent | FaintEvent | TriggerEffectEvent | TickEffectEvent;

interface Event<T extends EVENT_TYPE> {
	type: T;
	actorId: string;
	step: number;
}

export interface FaintEvent extends Event<EVENT_TYPE.FAINT> {}

export interface TickEffectEvent extends Event<EVENT_TYPE.TICK_EFFECT> {
	payload: TickEffectEventPayload;
}

export interface UseAbilityEvent extends Event<EVENT_TYPE.USE_ABILITY> {
	payload: UseAbilityEventPayload;
}

export interface UseAbilityEventPayload {
	id: string;
	name: string;
	targetsId: string[];
	subEvents: SubEvent[];
}

export interface TickEffectEventPayload {
	type: TICK_EFFECT_TYPE;
	targetId: string;
	payload: {
		value: number;
		decrement: number;
	};
}

export interface SubEvent {
	type: SUBEVENT_TYPE;
	payload: InstantEffectPossiblePayload;
	sourceId?: string;
}

type InstantEffectPossiblePayload =
	| InstantEffectPayload<INSTANT_EFFECT_TYPE.DAMAGE>
	| InstantEffectPayload<INSTANT_EFFECT_TYPE.HEAL>
	| InstantEffectPayload<INSTANT_EFFECT_TYPE.SHIELD>
	| InstantEffectPayload<INSTANT_EFFECT_TYPE.DISABLE>
	| InstantEffectPayload<INSTANT_EFFECT_TYPE.STATUS_EFFECT>;

export interface InstantEffectPayload<T extends INSTANT_EFFECT_TYPE> {
	type: T;
	targetId: string;
	payload: InstantEffectPayloadMap[T];
}

export type InstantEffectPayloadMap = {
	[INSTANT_EFFECT_TYPE.DAMAGE]: DamagePayload;
	[INSTANT_EFFECT_TYPE.HEAL]: HealPayload;
	[INSTANT_EFFECT_TYPE.SHIELD]: ShieldPayload;
	[INSTANT_EFFECT_TYPE.DISABLE]: DisablePayload[];
	[INSTANT_EFFECT_TYPE.STATUS_EFFECT]: StatusEffectPayload[];
};

export interface DamagePayload {
	value: number;
}

export interface HealPayload {
	value: number;
}

export interface ShieldPayload {
	value: number;
}

export interface DisablePayload {
	name: DISABLE;
	duration: number;
}

export interface StatusEffectPayload {
	name: STATUS_EFFECT;
	quantity: number;
}

// TRIGGER EFFECT EVENTS -----------------------------------------------

export interface TriggerEffectEvent extends Event<EVENT_TYPE.TRIGGER_EFFECT> {
	trigger: TRIGGER;
	subEvents: SubEvent[];
}

// NEW EVENT SYSTEM ---------------------------------------------------

export interface StepEffects {
	step: number;
	units: UnitEffects[];
	deadUnits?: string[]; // unitId
}

export interface UnitEffects {
	unitId: string;
	effects: PossibleEffect[];
}

export type PossibleEffect =
	| Effect<INSTANT_EFFECT_TYPE.DAMAGE>
	| Effect<INSTANT_EFFECT_TYPE.HEAL>
	| Effect<INSTANT_EFFECT_TYPE.SHIELD>
	| Effect<INSTANT_EFFECT_TYPE.DISABLE>
	| Effect<INSTANT_EFFECT_TYPE.STATUS_EFFECT>;

export interface Effect<T extends INSTANT_EFFECT_TYPE>
	extends Omit<InstantEffectPayload<T>, "targetId"> {}

/* 	
	example effects in EffectsInStepPerUnit:
	(only one effect per type)

	const effects = [
		{
			type: INSTANT_EFFECT_TYPE.DAMAGE,
			payload: {
				value: 10,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.HEAL,
			payload: {
				value: 10,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.SHIELD,
			payload: {
				value: 10,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.DISABLE,
			payload: [
				{
					name: DISABLE.STUN,
					duration: 10,
				},
			],
		},
		{
			type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
			payload: [
				{
					name: STATUS_EFFECT.FAST,
					quantity: 10,
				},
				{
					name: STATUS_EFFECT.ATTACK_POWER,
					quantity: 10,
				},
			],
		},
	];
 */

/* const effects = [
		{
			type: INSTANT_EFFECT_TYPE.DAMAGE,
			payload: {
				value: 10,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.SHIELD,
			payload: {
				value: 22,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.DAMAGE,
			payload: {
				value: 15,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
			payload: [
				{
					name: STATUS_EFFECT.ATTACK_POWER,
					quantity: 11,
				},
			],
		},
		{
			type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
			payload: [
				{
					name: STATUS_EFFECT.ATTACK_POWER,
					quantity: 18,
				},
			],
		},
		{
			type: INSTANT_EFFECT_TYPE.HEAL,
			payload: {
				value: 10,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.HEAL,
			payload: {
				value: 10,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.SHIELD,
			payload: {
				value: 10,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.SHIELD,
			payload: {
				value: 22,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
			payload: [
				{
					name: STATUS_EFFECT.FAST,
					quantity: 2,
				},
				{
					name: STATUS_EFFECT.ATTACK_POWER,
					quantity: 14,
				},
			],
		},
		{
			type: INSTANT_EFFECT_TYPE.DAMAGE,
			payload: {
				value: 15,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.DISABLE,
			payload: [
				{
					name: DISABLE.STUN,
					duration: 10,
				},
			],
		},
		{
			type: INSTANT_EFFECT_TYPE.SHIELD,
			payload: {
				value: 22,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.HEAL,
			payload: {
				value: 43,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.DAMAGE,
			payload: {
				value: 12,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.DISABLE,
			payload: [
				{
					name: DISABLE.STUN,
					duration: 10,
				},
			],
		},
		{
			type: INSTANT_EFFECT_TYPE.SHIELD,
			payload: {
				value: 5,
			},
		},
		{
			type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
			payload: [
				{
					name: STATUS_EFFECT.FAST,
					quantity: 10,
				},
				{
					name: STATUS_EFFECT.ATTACK_POWER,
					quantity: 10,
				},
			],
		},
		{
			type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
			payload: [
				{
					name: STATUS_EFFECT.FAST,
					quantity: 5,
				},
			],
		},
		{
			type: INSTANT_EFFECT_TYPE.DISABLE,
			payload: [
				{
					name: DISABLE.STUN,
					duration: 33,
				},
			],
		},
		{
			type: INSTANT_EFFECT_TYPE.HEAL,
			payload: {
				value: 43,
			},
		},
	];
 */
/* 
export interface EffectsInStep {
	step: number;
	effectsPerUnit: EffectsInStepPerUnit[];
}

export interface EffectsInStepPerUnit {
	unitId: string;
	effects: UnitPossibleEffectsInStep[];
}

export type UnitPossibleEffectsInStep =
	| UnitEffectsInStep<INSTANT_EFFECT_TYPE.DAMAGE>
	| UnitEffectsInStep<INSTANT_EFFECT_TYPE.HEAL>
	| UnitEffectsInStep<INSTANT_EFFECT_TYPE.SHIELD>
	| UnitEffectsInStep<INSTANT_EFFECT_TYPE.DISABLE>
	| UnitEffectsInStep<INSTANT_EFFECT_TYPE.STATUS_EFFECT>;

export interface UnitEffectsInStep<T extends INSTANT_EFFECT_TYPE>
	extends Omit<InstantEffectPayload<T>, "targetId"> {}
 */
