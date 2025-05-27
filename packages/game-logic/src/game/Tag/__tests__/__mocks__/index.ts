import { AbilityData } from "@/game/Ability/AbilityTypes";
import { EquipmentData } from "@/game/Equipment/EquipmentTypes";
import { PackUnitData } from "@/game/PackUnit/PackUnitTypes";
import * as CeremonialMace from "./CeremonialMace.json";
import * as CeremonialMaceAbility from "./CeremonialMaceAbility.json";
import * as Lumberjack from "./Lumberjack.json";
import * as WoodcuttersAxe from "./WoodcuttersAxe.json";
import * as WoodcuttersAxeAbility from "./WoodcuttersAxeAbility.json";

export default {
	Abilities: {
		CeremonialMaceAbility: CeremonialMaceAbility as AbilityData,
		WoodcuttersAxeAbility: WoodcuttersAxeAbility as AbilityData,
	},
	Trinkets: {},
	Weapons: {
		CeremonialMace: CeremonialMace as EquipmentData,
		WoodcuttersAxe: WoodcuttersAxe as EquipmentData,
	},
	Units: {
		Lumberjack: Lumberjack as PackUnitData,
	},
};
