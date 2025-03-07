import { PossibleMod } from "../Mod/ModTypes";
import { Hp } from "../Stat/StatTypes";
import { TAG } from "../Tag/TagTypes";
import { Tier } from "../Tier/TierTypes";

export type PackUnitData = {
	name: string;
	tags: TAG[];
	minimumTier: Tier;
	hp: Hp;
	implicits: PossibleMod[];
	defaultEquipment: string[]; // todo: implement this
};
