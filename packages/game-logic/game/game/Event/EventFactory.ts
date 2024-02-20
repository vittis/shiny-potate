import { VULNERABLE_LOSS_PER_HIT } from "../Ability/Ability";
import { POSITION } from "../BoardManager";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TRIGGER_EFFECT_TYPE, TriggerEffect } from "../Trigger/TriggerTypes";
import { Unit } from "../Unit/Unit";
import {
  EVENT_TYPE,
  INSTANT_EFFECT_TYPE,
  SUBEVENT_TYPE,
  SubEvent,
  TICK_EFFECT_TYPE,
  TickEffectEvent,
} from "./EventTypes";

export function createStatusEffectSubEvent(
  unit: Unit,
  effect: TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
) {
  const targets = unit.bm.getTarget(unit, effect.target);

  const subEvents = targets.map((target) => {
    const payloadStatusEffects = effect.payload.map((statusEffect) => ({
      name: statusEffect.name,
      quantity: statusEffect.quantity,
    }));

    return {
      type: SUBEVENT_TYPE.INSTANT_EFFECT,
      payload: {
        type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
        targetId: target.id,
        payload: [...payloadStatusEffects],
      },
    } as SubEvent;
  });

  return subEvents;
}

export function createHealSubEvent(
  unit: Unit,
  effect: TriggerEffect<TRIGGER_EFFECT_TYPE.HEAL>
) {
  const targets = unit.bm.getTarget(unit, effect.target);

  const subEvents = targets.map((target) => {
    return {
      type: SUBEVENT_TYPE.INSTANT_EFFECT,
      payload: {
        type: INSTANT_EFFECT_TYPE.HEAL,
        targetId: target.id,
        payload: {
          value: effect.payload.value,
        },
      },
    } as SubEvent;
  });

  return subEvents as SubEvent[];
}

export function createShieldSubEvent(
  unit: Unit,
  effect: TriggerEffect<TRIGGER_EFFECT_TYPE.SHIELD>
) {
  const targets = unit.bm.getTarget(unit, effect.target);

  const subEvents = targets.map((target) => {
    return {
      type: SUBEVENT_TYPE.INSTANT_EFFECT,
      payload: {
        type: INSTANT_EFFECT_TYPE.SHIELD,
        targetId: target.id,
        payload: {
          value: effect.payload.value,
        },
      },
    } as SubEvent;
  });

  return subEvents as SubEvent[];
}

export function createDamageSubEvent(
  unit: Unit,
  effect: TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>,
  damageModifier = 0
) {
  const targets = unit.bm.getTarget(unit, effect.target);

  const subEvents = targets.map((target) => {
    const targetVulnerableModifier =
      target.statusEffects.filter(
        (effect) => effect.name === STATUS_EFFECT.VULNERABLE
      )[0]?.quantity || 0;

    const targetDamageReductionModifier =
      target.stats.damageReductionModifier + targetVulnerableModifier;

    const finalModifier = damageModifier - targetDamageReductionModifier;

    const finalDamage = Math.max(
      0,
      Math.round(
        effect.payload.value + (effect.payload.value * finalModifier) / 100
      )
    );

    return {
      type: SUBEVENT_TYPE.INSTANT_EFFECT,
      payload: {
        type: INSTANT_EFFECT_TYPE.DAMAGE,
        targetId: target.id,
        payload: {
          value: finalDamage,
        },
      },
    } as SubEvent;
  });

  return subEvents as SubEvent[];
}

export function createTickEffectEvent(
  unit: Unit,
  effect: TICK_EFFECT_TYPE,
  value: number
) {
  const tickEffectEvent = {
    type: EVENT_TYPE.TICK_EFFECT,
    actorId: unit.id,
    step: unit.currentStep,
    payload: {
      type: effect,
      targetId: unit.id,
      payload: {
        value,
        decrement: 1,
      },
    },
  };

  return tickEffectEvent as TickEffectEvent;
}
