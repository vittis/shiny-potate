import { EquipmentData } from "../Equipment/EquipmentTypes";
import * as ShortSpear from "../../data/equipment/weapons/ShortSpear.json";
import * as Sword from "../../data/equipment/weapons/Sword.json";
import * as Dagger from "../../data/equipment/weapons/Dagger.json";
import * as VenomousDagger from "../../data/equipment/weapons/VenomousDagger.json";
import * as Shortbow from "../../data/equipment/weapons/Shortbow.json";
import * as Longbow from "../../data/equipment/weapons/Longbow.json";
import * as Axe from "../../data/equipment/weapons/Axe.json";
import * as Wand from "../../data/equipment/weapons/Wand.json";
import * as Staff from "../../data/equipment/weapons/Staff.json";

// todo any way to make this import/export dynamically?

export default {
	ShortSpear: ShortSpear as EquipmentData,
	Sword: Sword as EquipmentData,
	Dagger: Dagger as EquipmentData,
	VenomousDagger: VenomousDagger as EquipmentData,
	Shortbow: Shortbow as EquipmentData,
	Longbow: Longbow as EquipmentData,
	Axe: Axe as EquipmentData,
	Wand: Wand as EquipmentData,
	Staff: Staff as EquipmentData,
};
