import * as FocusedMind from "../../data/perks/FocusedMind.json";
import * as VitalityBoost from "../../data/perks/VitalityBoost.json";
import * as DesperateWill from "../../data/perks/DesperateWill.json";
import * as LastWords from "../../data/perks/LastWords.json";
import * as Berserk from "../../data/perks/Berserk.json";
import * as RangedProficiency from "../../data/perks/RangedProficiency.json";
import * as PreyTheWeak from "../../data/perks/PreyTheWeak.json";
import * as DampeningField from "../../data/perks/DampeningField.json";
import * as DemonicPresence from "../../data/perks/DemonicPresence.json";
import * as FallenGuardian from "../../data/perks/FallenGuardian.json";
import * as IronHeart from "../../data/perks/IronHeart.json";
import * as SavageFury from "../../data/perks/SavageFury.json";
import * as VengefulLegacy from "../../data/perks/VengefulLegacy.json";
import * as VenomousStrikes from "../../data/perks/VenomousStrikes.json";
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
	DampeningField: DampeningField as PerkData,
	DemonicPresence: DemonicPresence as PerkData,
	FallenGuardian: FallenGuardian as PerkData,
	IronHeart: IronHeart as PerkData,
	SavageFury: SavageFury as PerkData,
	VengefulLegacy: VengefulLegacy as PerkData,
	VenomousStrikes: VenomousStrikes as PerkData,
};

export default Perks as typeof Perks & PerksMap;
