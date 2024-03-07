import { Weapons } from "../data";
import { ShopEquipmentData } from "./EquipmentTypes";
import { ShopEquipment } from "./ShopEquipment";

export function generateWeaponsFromTier(tier: number) {
	const weapons: ShopEquipmentData[] = [];

	Object.keys(Weapons).forEach(key => {
		let weapon = new ShopEquipment((Weapons as any)[key], tier).generateEquipmentData();

		weapons.push(weapon);
	});

	return weapons;
}
