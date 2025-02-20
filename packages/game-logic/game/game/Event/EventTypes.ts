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
	subStep?: number;
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
	subSteps?: SubStepEffects[];
	deadUnits?: string[]; // unitId / only used on SubStepEffects
}

export interface SubStepEffects extends Omit<StepEffects, "step" | "subSteps"> {
	subStep: number;
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
	when a unit dies, the death related events are added to a "subEvent"
	the events have subEvent = 1, 2, 3, 4, etc
	the effects have a subEffect array with the same subEvent number
	
	events of step X are played together
	then events of step X subStep 1 are played together
	then events of step X subStep 2 are played together
	etc
*/

// INTENT

interface Intent<T extends EVENT_TYPE> {
	type: T;
}

export type PossibleIntent = UseAbilityIntent | TriggerEffectEvent | FaintEvent | TickEffectEvent;

export interface UseAbilityIntent extends Intent<EVENT_TYPE.USE_ABILITY> {
	actorId: string;
	id: string;
	useMultistrike: boolean;
}
