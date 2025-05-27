import { PossibleModTemplate } from "@/game/Mod/ModTypes";
import { TAG } from "@/game/Tag/TagTypes";
import { Tier, TieredValues } from "@/game/Tier/TierTypes";

export type PackUnitData = {
	name: string;
	tags: TAG[];
	minimumTier: Tier;
	hp: TieredValues;
	implicits: PossibleModTemplate[];
	defaultEquipment?: string[]; // todo: implement this | idk if its here or mechanic during the game
};
