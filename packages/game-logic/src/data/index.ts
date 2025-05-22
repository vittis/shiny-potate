import { AbilityData } from "../game/Ability/AbilityTypes";
import { EquipmentData } from "../game/Equipment/EquipmentTypes";
import { PackUnitData } from "../game/PackUnit/PackUnitTypes";
import * as CeremonialMaceAbility from "./abilities/CeremonialMaceAbility.json";
import * as HeaterShieldAbility from "./abilities/HeaterShieldAbility.json";
import * as RoundSwing from "./abilities/RoundSwing.json";
import * as TwistOfFate from "./abilities/TwistOfFate.json";
import * as WoodcuttersAxeAbility from "./abilities/WoodcuttersAxeAbility.json";
import * as BootsOfHaste from "./equipment/trinkets/BootsOfHaste.json";
import * as CeremonialMace from "./equipment/weapons/CeremonialMace.json";
import * as HeaterShield from "./equipment/weapons/HeaterShield.json";
import * as WoodcuttersAxe from "./equipment/weapons/WoodcuttersAxe.json";
import * as FarmBoy from "./units/FarmBoy.json";
import * as FortuneTeller from "./units/FortuneTeller.json";
import * as Lumberjack from "./units/Lumberjack.json";

export default {
	Abilities: {
		CeremonialMaceAbility: CeremonialMaceAbility as AbilityData,
		HeaterShieldAbility: HeaterShieldAbility as AbilityData,
		RoundSwing: RoundSwing as AbilityData,
		TwistOfFate: TwistOfFate as AbilityData,
		WoodcuttersAxeAbility: WoodcuttersAxeAbility as AbilityData,
	},
	Trinkets: {
		BootsOfHaste: BootsOfHaste as EquipmentData,
	},
	Weapons: {
		CeremonialMace: CeremonialMace as EquipmentData,
		HeaterShield: HeaterShield as EquipmentData,
		WoodcuttersAxe: WoodcuttersAxe as EquipmentData,
	},
	Units: {
		FarmBoy: FarmBoy as PackUnitData,
		FortuneTeller: FortuneTeller as PackUnitData,
		Lumberjack: Lumberjack as PackUnitData,
	},
};
