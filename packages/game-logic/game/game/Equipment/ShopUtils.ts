import RandomDataGenerator from "../../utils/math";
import { Weapons } from "../data";
import { EquipmentData, ShopEquipmentData } from "./EquipmentTypes";
import { ShopEquipment } from "./ShopEquipment";

export function generateWeaponsFromTier(tier: number, { quantityPerWeapon = 3 }) {
	const weapons: ShopEquipmentData[] = [];

	Object.keys(Weapons).forEach(key => {
		for (let i = 0; i < quantityPerWeapon; i++) {
			let weapon = new ShopEquipment((Weapons as any)[key], tier).generateShopEquipmentData();
			weapons.push(weapon);
		}
	});

	return weapons;
}

export function generateRandomWeapons({ quantityPerWeapon = 3 }) {
	const weapons: ShopEquipmentData[] = [];

	Object.keys(Weapons).forEach(key => {
		for (let i = 0; i < quantityPerWeapon; i++) {
			let weapon = new ShopEquipment(
				(Weapons as any)[key],
				RandomDataGenerator.between(0, 5),
			).generateShopEquipmentData();
			weapons.push(weapon);
		}
	});

	return weapons;
}

export function generateEquipmentData(data: ShopEquipmentData): EquipmentData {
	const { tier, ...equipmentData } = data;

	return equipmentData as EquipmentData;
}
