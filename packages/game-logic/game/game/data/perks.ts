import * as FocusedMind from "../../data/perks/FocusedMind.json";
import * as VitalityBoost from "../../data/perks/VitalityBoost.json";
import * as DesperateWill from "../../data/perks/DesperateWill.json";
import * as LastWords from "../../data/perks/LastWords.json";
import * as Berserk from "../../data/perks/Berserk.json";
import * as RangedProficiency from "../../data/perks/RangedProficiency.json";
import * as PreyTheWeak from "../../data/perks/PreyTheWeak.json";
import { PerkData } from "../Perk/PerkTypes";

type PerksMap = {
	[key: string]: PerkData;
};

const Perks = {
	FocusedMind: FocusedMind as PerkData,
	VitalityBoost: VitalityBoost as PerkData,
	DesperateWill: DesperateWill as PerkData,
	LastWords: LastWords as PerkData,
	Berserk: Berserk as PerkData,
	RangedProficiency: RangedProficiency as PerkData,
	PreyTheWeak: PreyTheWeak as PerkData,
};

export default Perks as typeof Perks & PerksMap;
