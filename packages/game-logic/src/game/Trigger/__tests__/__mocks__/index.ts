import { AbilityData } from "@/game/Ability/AbilityTypes";
import { EquipmentData } from "@/game/Equipment/EquipmentTypes";
import { PackUnitData } from "@/game/PackUnit/PackUnitTypes";
import * as BootsOfHaste from "./BootsOfHaste.json";
import * as FarmBoy from "./FarmBoy.json";
import * as FortuneTeller from "./FortuneTeller.json";
import * as HeaterShield from "./HeaterShield.json";
import * as HeaterShieldAbility from "./HeaterShieldAbility.json";
import * as Lumberjack from "./Lumberjack.json";
import * as TwistOfFate from "./TwistOfFate.json";
("./WoodcuttersAxeAbility.json");

export default {
	Abilities: {
		HeaterShieldAbility: HeaterShieldAbility as AbilityData,
		TwistOfFate: TwistOfFate as AbilityData,
	},
	Trinkets: {
		BootsOfHaste: BootsOfHaste as EquipmentData,
	},
	Weapons: {
		HeaterShield: HeaterShield as EquipmentData,
	},
	Units: {
		FarmBoy: FarmBoy as PackUnitData,
		FortuneTeller: FortuneTeller as PackUnitData,
		Lumberjack: Lumberjack as PackUnitData,
	},
};
