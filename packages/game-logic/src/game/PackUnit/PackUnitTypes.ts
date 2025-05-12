import { PossibleModTemplate } from "../Mod/ModTypes";
import { Hp } from "../Stats/StatsTypes";
import { TAG } from "../Tag/TagTypes";
import { Tier, TieredValues } from "../Tier/TierTypes";

export type PackUnitData = {
	name: string;
	tags: TAG[];
	minimumTier: Tier;
	hp: TieredValues;
	implicits: PossibleModTemplate[];
	defaultEquipment?: string[]; // todo: implement this | idk if its here or mechanic during the game
};
