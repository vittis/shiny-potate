import { nanoid } from "nanoid";
import { PerkDataSchema } from "./PerkSchema";
import { PERK_TYPE, PerkData } from "./PerkTypes";
import { PossibleTriggerEffect, TRIGGER_EFFECT_TYPE } from "../Trigger/TriggerTypes";

export class Perk {
	id: string;
	data: PerkData;
	tier: number = 1;

	// todo test if tier is working alright
	constructor(data?: PerkData, tier?: number) {
		if (!data) {
			throw Error(
				"Perk data is undefined. If running from test make sure it's defined in mock files",
			);
		}
		const parsedData = PerkDataSchema.parse(data);
		if (tier) {
			this.tier = tier;
		}
		this.data = parsedData;
		this.id = nanoid(8);
	}

	getTierValue(name: string) {
		const tierMatch = this.data.tiers.find(tier => tier.name === name);
		const tierMatchValue = tierMatch?.values?.[this.tier - 1];
		if (tierMatchValue === undefined) {
			throw Error(`Tier match not found for perk: ${this.data.name}`);
		}

		return tierMatchValue;
	}

	getTriggerEffects() {
		// PERK_TYPE = UNIQUE
		if (this.data.type === PERK_TYPE.UNIQUE) {
			return this.data.effects;
		}

		// PERK_TYPE = TIER_SCALE
		return this.data.effects.map(effect => {
			if (effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
				return {
					...effect,
					payload: {
						value: this.getTierValue("DAMAGE"),
					},
				};
			} else if (effect.type === TRIGGER_EFFECT_TYPE.HEAL) {
				return {
					...effect,
					payload: {
						value: this.getTierValue("HEAL"),
					},
				};
			} else if (effect.type === TRIGGER_EFFECT_TYPE.SHIELD) {
				return {
					...effect,
					payload: {
						value: this.getTierValue("SHIELD"),
					},
				};
			} else if (effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT) {
				return {
					...effect,
					payload: effect.payload.map(statusPayload => ({
						...statusPayload,
						quantity: this.getTierValue(statusPayload.name),
					})),
				};
			} else if (effect.type === TRIGGER_EFFECT_TYPE.DISABLE) {
				return {
					...effect,
					payload: effect.payload.map(disablePayload => ({
						...disablePayload,
						quantity: this.getTierValue(disablePayload.name),
					})),
				};
			}
		}) as PossibleTriggerEffect[];
	}
}
