import { ModEffectPayload } from "@/game/Mod/ModTypes";

export enum EVENT_TYPE {
	USE_ABILITY = "USE_ABILITY",
	FAINT = "FAINT",
	TRIGGER_EFFECT = "TRIGGER_EFFECT",
	TICK_EFFECT = "TICK_EFFECT",
}

export enum SUBEVENT_TYPE {
	INSTANT_EFFECT = "INSTANT_EFFECT",
}

export enum TICK_EFFECT_TYPE {
	REGEN = "REGEN",
	POISON = "POISON",
}

export type PossibleEvent = UseAbilityEvent | FaintEvent /* | TriggerEffectEvent | TickEffectEvent */;

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
	targetsId: string[];
	payload: SubEventPayload;
	sourceId?: string;
}

export type SubEventPayload = ModEffectPayload;

// Step Effects ---------------------------------------------------

export interface StepEffects {
	step: number;
	units: UnitEffects[];
	deadUnits?: string[]; // unitId / only used on SubStepEffects
}

export interface UnitEffects {
	unitId: string;
	effects: ModEffectPayload[]; // todo pode ser ModStatPayload
}

// Intents ------------------------------------------

interface Intent<T extends EVENT_TYPE> {
	type: T;
}

export type PossibleIntent = UseAbilityIntent /* | TriggerEffectEvent | FaintEvent | TickEffectEvent */;

export interface UseAbilityIntent extends Intent<EVENT_TYPE.USE_ABILITY> {
	actorId: string;
	id: string;
}
