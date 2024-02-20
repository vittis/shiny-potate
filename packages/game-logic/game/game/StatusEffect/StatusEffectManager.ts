import { createTickEffectEvent } from "../Event/EventFactory";
import { TICK_EFFECT_TYPE } from "../Event/EventTypes";
import { Unit } from "../Unit/Unit";
import { ActiveStatusEffect, STATUS_EFFECT } from "./StatusEffectTypes";

export class StatusEffectManager {
  private _activeStatusEffects = [] as ActiveStatusEffect[];
  poisonTickProgress = 0;
  regenTickProgress = 0;
  tickCooldown = 20; // TODO: move to config

  constructor() {}

  get activeStatusEffects() {
    return this._activeStatusEffects;
  }

  applyStatusEffect(statusEffect: ActiveStatusEffect) {
    const alreadyHasStatusEffect = this.hasStatusEffect(statusEffect.name);
    if (alreadyHasStatusEffect) {
      this._activeStatusEffects = this._activeStatusEffects.map((effect) => {
        if (effect.name === statusEffect.name) {
          return {
            ...effect,
            quantity: effect.quantity + statusEffect.quantity,
          };
        }
        return effect;
      });
    } else {
      this._activeStatusEffects = [...this._activeStatusEffects, statusEffect];
    }
  }

  hasStatusEffect(name: STATUS_EFFECT) {
    return this._activeStatusEffects.some(
      (statusEffect) => statusEffect.name === name
    );
  }

  removeStacks(name: STATUS_EFFECT, quantity: number) {
    this._activeStatusEffects = this._activeStatusEffects.reduce(
      (acc, effect) => {
        if (effect.name === name) {
          const finalQuantity = Math.max(0, effect.quantity - quantity);
          if (finalQuantity === 0) {
            return acc;
          }
          return [
            ...acc,
            {
              ...effect,
              quantity: finalQuantity,
            },
          ];
        }
        return [...acc, effect];
      },
      [] as ActiveStatusEffect[]
    );
  }

  removeAllStacks(name: STATUS_EFFECT) {
    const index = this._activeStatusEffects.findIndex(
      (statusEffect) => statusEffect.name === name
    );
    if (index === -1) {
      return;
    }

    this._activeStatusEffects.splice(index, 1);
  }

  tickStep(name: STATUS_EFFECT) {
    if (name === STATUS_EFFECT.POISON) {
      this.poisonTickProgress += 1;
    } else if (name === STATUS_EFFECT.REGEN) {
      this.regenTickProgress += 1;
    }
  }

  canTick(name: STATUS_EFFECT) {
    if (name === STATUS_EFFECT.POISON) {
      return this.poisonTickProgress >= this.tickCooldown;
    } else if (name === STATUS_EFFECT.REGEN) {
      return this.regenTickProgress >= this.tickCooldown;
    }
  }

  tickEffectStep(unit: Unit) {
    const tickStatusEffects = [STATUS_EFFECT.POISON, STATUS_EFFECT.REGEN];

    tickStatusEffects.forEach((statusEffect) => {
      if (this.hasStatusEffect(statusEffect)) {
        this.tickStep(statusEffect);

        if (this.canTick(statusEffect)) {
          this.poisonTickProgress = 0;

          const value =
            this.activeStatusEffects.find(
              (effect) => effect.name === statusEffect
            )?.quantity || 0;

          const event = createTickEffectEvent(
            unit,
            statusEffect === STATUS_EFFECT.POISON
              ? TICK_EFFECT_TYPE.POISON
              : TICK_EFFECT_TYPE.REGEN, // TODO: improve this
            value
          );

          if (event) {
            unit.stepEvents.push(event);
          }
        }
      }
    });
  }
}
