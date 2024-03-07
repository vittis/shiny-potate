import { Weapons } from "../data";
import { EquipmentData } from "./EquipmentTypes";
import { ShopEquipment } from "./ShopEquipment";

export function generateWeaponsFromTier(tier: number) {
	const weapons: EquipmentData[] = [];

	Object.keys(Weapons).forEach(key => {
		let weapon = new ShopEquipment((Weapons as any)[key], tier).generateEquipmentData();

		weapons.push(weapon);
	});

	return weapons;
}
