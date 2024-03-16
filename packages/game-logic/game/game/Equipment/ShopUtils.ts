import { Class, Unit } from "../..";
import RandomDataGenerator from "../../utils/math";
import { Trinkets, Classes, Weapons } from "../data";
import { Equipment } from "./Equipment";
import { EQUIPMENT_SLOT, EQUIPMENT_TYPE, EquipmentData, ShopEquipmentData } from "./EquipmentTypes";
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

export function getUnitData(
	boardUnit: { id: string; name: string; equipment?: any[] },
	owner: number,
	position: string,
) {
	const unit = new Unit(owner, parseInt(position));
	unit.setClass(new Class(Classes[boardUnit.name as keyof typeof Classes]));

	if (boardUnit?.equipment && boardUnit?.equipment?.length > 0) {
		boardUnit.equipment.forEach((shopEquip: any) => {
			const equipmentData = generateEquipmentData(shopEquip.data);

			if (equipmentData.slots.includes(EQUIPMENT_SLOT.TWO_HANDS)) {
				unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.TWO_HANDS);
			} else {
				unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.MAIN_HAND);
			}
		});
	}

	const serializedUnit = unit.serialize();

	return unit;
}
