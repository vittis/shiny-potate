import { EQUIPMENT_TAG } from "../Equipment/EquipmentTypes"
import { PossibleTriggerEffect, TriggerEffect } from "../Trigger/TriggerTypes"

export enum PERK_TYPE {
	TIER_SCALE = "TIER_SCALE",
	UNIQUE = "UNIQUE",
}

export interface PerkTierScale {
	name: string
	values: number[]
}

export interface PerkTag {
	name: EQUIPMENT_TAG
	weight: number
}

export interface PerkData {
	name: string
	type: PERK_TYPE
	tiers: PerkTierScale[]
	effects: PossibleTriggerEffect[]
	tags?: PerkTag[]
}
