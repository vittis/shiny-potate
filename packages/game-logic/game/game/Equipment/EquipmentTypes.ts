import { ModTag, PossibleMods } from "../Mods/ModsTypes";
import { STAT } from "../Stats/StatsTypes";
import { PossibleTriggerEffect } from "../Trigger/TriggerTypes";

export enum EQUIPMENT_SLOT {
	MAIN_HAND = "MAIN_HAND",
	OFF_HAND = "OFF_HAND",
	TWO_HANDS = "TWO_HANDS",
	TRINKET = "TRINKET",
	TRINKET_2 = "TRINKET_2", // TODO create another enum to not include this on equipment json, only on EquipmentManager ?
}

export enum EQUIPMENT_TAG {
	WEAPON = "WEAPON",
	PHYSICAL = "PHYSICAL",
	MAGICAL = "MAGICAL",
	RANGED = "RANGED",
	TRINKET = "TRINKET",
	SHIELD = "SHIELD",
	DEFENSE = "DEFENSE",
}

export enum EQUIPMENT_TYPE {
	WEAPON = "WEAPON",
	TRINKET = "TRINKET",
}

// this represents the JSON of the equipment
export interface EquipmentData {
	name: string;
	tags: EQUIPMENT_TAG[];
	slots: EQUIPMENT_SLOT[];
	mods: PossibleMods;
	effects: PossibleTriggerEffect[];
}

export interface ShopEquipmentData extends EquipmentData {
	tier: number;
}

export interface EquipmentStatsData {
	name: STAT;
	tiers: number[];
	tags: ModTag[];
}
