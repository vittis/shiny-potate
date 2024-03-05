import { nanoid } from "nanoid"
import { EquipmentDataSchema } from "./EquipmentSchema"
import { EQUIPMENT_TAG, EquipmentData } from "./EquipmentTypes"
import { GrantPerkPayload, MOD_TYPE, Mod, PossibleMods, ShopItemMod } from "../Mods/ModsTypes"
import { Perks } from "../data"

export class ShopEquipment {
	id: string
	data: EquipmentData

	tier: number
	rolledMods!: PossibleMods

	// todo: applicableMods here
	//  applicableMods = []

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

		// this.applicableMods = [...this.getAllApplicablePerksMods(), ...this.getAllApplicableStatsMods()]
	}

	// todo: rename to getAllPerksApplicableMods, later add getAllStaApplicableMods
	getAllApplicableMods(): ShopItemMod[] {
		let applicableMods: ShopItemMod[] = []

		Object.keys(Perks).forEach(key => {
			const perkData = Perks[key]

			if (!perkData.tags) {
				return
			}

			perkData.tags?.forEach(perkTag => {
				if (this.data.tags.includes(perkTag.name)) {
					const incomingMod = {
						mod: {
							type: MOD_TYPE.GRANT_PERK,
							payload: {
								name: perkData.name,
							},
						},
						weight: perkTag.weight,
					} as ShopItemMod

					const alreadyHasMod = applicableMods.find(
						// @ts-ignore TODO fix type
						mod => mod.mod.payload.name === incomingMod.mod.payload.name,
					)

					if (!alreadyHasMod) {
						applicableMods.push(incomingMod)
					} else {
						applicableMods = applicableMods.map(mod => {
							// @ts-ignore TODO fix type
							if (mod.mod.payload.name === incomingMod.mod.payload.name) {
								return {
									...mod,
									weight: mod.weight + incomingMod.weight,
								}
							}
							return mod
						})
					}
				}
			})
		})

		return applicableMods
	}
}

/* 
			[
				{
					mod: {
						"type": "GRANT_PERK",
						"payload": {
							"name": "Focused Mind"
						}
					}
					"weight": 2,
				},
				{},
				{}
			]
		
		*/
