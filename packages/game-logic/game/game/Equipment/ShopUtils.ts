import RandomDataGenerator from "../../utils/math";
import { Trinkets, Weapons } from "../data";
import { EQUIPMENT_TYPE, EquipmentData, ShopEquipmentData } from "./EquipmentTypes";
import { ShopEquipment } from "./ShopEquipment";

export function generateItemsFromTier(tier: number, { quantityPerItem = 3 }, type: EQUIPMENT_TYPE) {
	const items: ShopEquipmentData[] = [];
	const itemDatabase = type === EQUIPMENT_TYPE.WEAPON ? Weapons : Trinkets;

	Object.keys(itemDatabase).forEach(key => {
		for (let i = 0; i < quantityPerItem; i++) {
			let item = new ShopEquipment((itemDatabase as any)[key], tier).generateShopEquipmentData();
			items.push(item);
		}
	});

	return items;
}

export function generateRandomItems({ quantityPerItem = 3 }, type: EQUIPMENT_TYPE) {
	const items: ShopEquipmentData[] = [];
	const itemDatabase = type === EQUIPMENT_TYPE.WEAPON ? Weapons : Trinkets;

	Object.keys(itemDatabase).forEach(key => {
		for (let i = 0; i < quantityPerItem; i++) {
			let item = new ShopEquipment(
				(itemDatabase as any)[key],
				RandomDataGenerator.between(0, 5),
			).generateShopEquipmentData();
			items.push(item);
		}
	});

	return items;
}

export function generateEquipmentData(data: ShopEquipmentData): EquipmentData {
	const { tier, ...equipmentData } = data;

	return equipmentData as EquipmentData;
}
