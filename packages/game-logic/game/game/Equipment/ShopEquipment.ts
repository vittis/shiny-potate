import { nanoid } from "nanoid"
import { EquipmentDataSchema } from "./EquipmentSchema"
import { EquipmentData } from "./EquipmentTypes"
import { PossibleMods } from "../Mods/ModsTypes"

export class ShopEquipment {
	id: string
	data: EquipmentData

	tier: number
	rolledMods!: PossibleMods

	constructor(data: EquipmentData, tier: number) {
		if (!data) {
			throw Error(
				"Equipment data is undefined. If running from test make sure it's defined in mock files",
			)
		}
		const parsedData = EquipmentDataSchema.parse(data)
		this.data = parsedData
		this.id = nanoid(8)
		this.tier = tier

		// generate mods based on tier
	}

	getAllApplicableMods() {}
}

/* 
 [
 {

 }



 ]




*/
