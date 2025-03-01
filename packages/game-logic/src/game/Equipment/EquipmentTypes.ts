import { PossibleMod } from "../Mod/ModTypes";
import { TAG } from "../Tag/TagTypes";
import { Tier } from "../Tier/TierTypes";

export enum EQUIPMENT_SLOT {
	MAIN_HAND = "MAIN_HAND",
	OFF_HAND = "OFF_HAND",
	TRINKET = "TRINKET",
	// TWO_HANDS = "TWO_HANDS", add later
}

export type EquipmentData = {
	name: string;
	tags: TAG[];
	slots: EQUIPMENT_SLOT[];
	minimumTier: Tier;
	ability?: string; // name of the ability
	implicits: PossibleMod[];
};
