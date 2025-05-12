import { PackUnitData } from "../game/PackUnit/PackUnitTypes";
import * as Lumberjack from "./units/Lumberjack.json";
import * as FortuneTeller from "./units/FortuneTeller.json";
import * as BootsOfHaste from "./equipment/trinkets/BootsOfHaste.json";
import * as CeremonialMace from "./equipment/weapons/CeremonialMace.json";
import * as WoodcuttersAxe from "./equipment/weapons/WoodcuttersAxe.json";
import * as RoundSwing from "./abilities/RoundSwing.json";
import * as CeremonialMaceAbility from "./abilities/CeremonialMaceAbility.json";
import * as WoodcuttersAxeAbility from "./abilities/WoodcuttersAxeAbility.json";
import * as TwistOfFate from "./abilities/TwistOfFate.json";
import { EquipmentData } from "../game/Equipment/EquipmentTypes";
import { AbilityData } from "../game/Ability/AbilityTypes";

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
