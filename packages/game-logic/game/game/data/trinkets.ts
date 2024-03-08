import { EquipmentData } from "../Equipment/EquipmentTypes";
import * as BrainsInAJar from "../../data/equipment/trinkets/BrainsInAJar.json";
import * as KamesLostSash from "../../data/equipment/trinkets/KamesLostSash.json";
import * as OrbOfCoagulatedBlood from "../../data/equipment/trinkets/OrbOfCoagulatedBlood.json";
import * as SagesBrandNewHat from "../../data/equipment/trinkets/SagesBrandNewHat.json";
import * as ScoutsEye from "../../data/equipment/trinkets/ScoutsEye.json";
import * as TrainingArmbands from "../../data/equipment/trinkets/TrainingArmbands.json";

// todo any way to make this import/export dynamically?

export default {
	BrainsInAJar: BrainsInAJar as EquipmentData,
	KamesLostSash: KamesLostSash as EquipmentData,
	OrbOfCoagulatedBlood: OrbOfCoagulatedBlood as EquipmentData,
	SagesBrandNewHat: SagesBrandNewHat as EquipmentData,
	ScoutsEye: ScoutsEye as EquipmentData,
	TrainingArmbands: TrainingArmbands as EquipmentData,
};
