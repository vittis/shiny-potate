import { AbilityData } from "@/game/Ability/AbilityTypes";
import { EquipmentData } from "@/game/Equipment/EquipmentTypes";
import { PackUnitData } from "@/game/PackUnit/PackUnitTypes";
import * as BootsOfHaste from "./BootsOfHaste.json";
import * as FortuneTeller from "./FortuneTeller.json";
import * as Lumberjack from "./Lumberjack.json";
import * as RoundSwing from "./RoundSwing.json";
import * as TwistOfFate from "./TwistOfFate.json";

export default {
	Abilities: {
		RoundSwing: RoundSwing as AbilityData,
		TwistOfFate: TwistOfFate as AbilityData,
	},
	Trinkets: {
		BootsOfHaste: BootsOfHaste as EquipmentData,
	},
	Weapons: {},
	Units: {
		FortuneTeller: FortuneTeller as PackUnitData,
		Lumberjack: Lumberjack as PackUnitData,
	},
};
