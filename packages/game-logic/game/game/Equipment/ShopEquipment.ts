import { nanoid } from "nanoid";
import { EquipmentDataSchema } from "./EquipmentSchema";
import { EquipmentData, EquipmentInstance } from "./EquipmentTypes";
import { PossibleMods, ShopItemMod } from "../Mods/ModsTypes";
import {
	generateRolledMods,
	getAllApplicablePerkMods,
	getAllApplicableStatMods,
	rollTieredMods,
} from "./EquipmentUtils";

export const MOD_LIMIT = 4;

// todo merge with equipment
export class ShopEquipment {
	id: string;
	data: EquipmentData;

	tier: number;
	rolledMods: PossibleMods;

	applicableMods: ShopItemMod[] = [];

	constructor(data: EquipmentData, tier: number) {
		if (!data) {
			throw Error(
				"ShopEquipment: Equipment data is undefined. If running from test make sure it's defined in mock files",
			);
		}
		try {
			const parsedData = EquipmentDataSchema.parse(data);
			this.data = parsedData;
		} catch (e: any) {
			throw Error(`Equipment: ${data.name} data is invalid. ${e?.message}`);
		}

		this.id = nanoid(8);
		this.tier = tier;

		this.applicableMods = [
			...getAllApplicablePerkMods(data.tags),
			...getAllApplicableStatMods(data.tags),
		];
		this.rolledMods = generateRolledMods(rollTieredMods(this.applicableMods, this.tier));
	}

	generateShopEquipmentData(): EquipmentInstance {
		return {
			...this.data,
			tier: this.tier,
			mods: [...this.data.mods, ...this.rolledMods],
		};
	}

	// todo do this properly
	/* serialize() {
		return {
			id: this.id,
			data: {
				...this.data,
				mods: [...this.data.mods, ...this.rolledMods],
			},
			tier: this.tier,
		};
	} */
}
