import { EquipmentData } from "@/game/Equipment/EquipmentTypes";
import { PackUnitData } from "../../../PackUnit/PackUnitTypes";
import { AbilityData } from "../../AbilityTypes";
import * as BootsOfHaste from "./BootsOfHaste.json";
import * as CeremonialMace from "./CeremonialMace.json";
import * as CeremonialMaceAbility from "./CeremonialMaceAbility.json";
import * as FortuneTeller from "./FortuneTeller.json";
import * as Lumberjack from "./Lumberjack.json";
import * as RoundSwing from "./RoundSwing.json";
import * as TwistOfFate from "./TwistOfFate.json";
import * as WoodcuttersAxe from "./WoodcuttersAxe.json";
import * as WoodcuttersAxeAbility from "./WoodcuttersAxeAbility.json";

export default {
	Abilities: {
		CeremonialMaceAbility: CeremonialMaceAbility as AbilityData,
		RoundSwing: RoundSwing as AbilityData,
		TwistOfFate: TwistOfFate as AbilityData,
		WoodcuttersAxeAbility: WoodcuttersAxeAbility as AbilityData,
	},
	Trinkets: {
		BootsOfHaste: BootsOfHaste as EquipmentData,
	},
	Weapons: {
		CeremonialMace: CeremonialMace as EquipmentData,
		WoodcuttersAxe: WoodcuttersAxe as EquipmentData,
	},
	Units: {
		FortuneTeller: FortuneTeller as PackUnitData,
		Lumberjack: Lumberjack as PackUnitData,
	},
};
