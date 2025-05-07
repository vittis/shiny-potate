import { PackUnitData } from "../game/PackUnit/PackUnitTypes";
import * as Lumberjack from "./units/Lumberjack.json";
import * as CeremonialMace from "./equipment/weapons/CeremonialMace.json";
import { EquipmentData } from "../game/Equipment/EquipmentTypes";

export default {
	Units: {
		Lumberjack: Lumberjack as PackUnitData,
	},
	Weapons: {
		CeremonialMace: CeremonialMace as EquipmentData,
	},
};
