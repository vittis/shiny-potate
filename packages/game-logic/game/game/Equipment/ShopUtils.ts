import { Weapons } from "../data";
import { EquipmentData, ShopEquipmentData } from "./EquipmentTypes";
import { ShopEquipment } from "./ShopEquipment";

export function generateWeaponsFromTier(tier: number) {
	const weapons: ShopEquipmentData[] = [];

	Object.keys(Weapons).forEach(key => {
		let weapon = new ShopEquipment((Weapons as any)[key], tier).generateShopEquipmentData();

		weapons.push(weapon);
	});

	return weapons;
}

export function generateEquipmentData(data: ShopEquipmentData): EquipmentData {
	const { tier, ...equipmentData } = data;

	return equipmentData as EquipmentData;
}
