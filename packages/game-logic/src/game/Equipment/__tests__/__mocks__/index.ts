import { AbilityData } from "@/game/Ability/AbilityTypes";
import { EquipmentData } from "@/game/Equipment/EquipmentTypes";
import { PackUnitData } from "@/game/PackUnit/PackUnitTypes";
import * as CeremonialMace from "./CeremonialMace.json";
import * as CeremonialMaceAbility from "./CeremonialMaceAbility.json";
import * as Lumberjack from "./Lumberjack.json";

export default {
	Abilities: {
		CeremonialMaceAbility: CeremonialMaceAbility as AbilityData,
	},
	Trinkets: {},
	Weapons: {
		CeremonialMace: CeremonialMace as EquipmentData,
	},
	Units: {
		Lumberjack: Lumberjack as PackUnitData,
	},
};
