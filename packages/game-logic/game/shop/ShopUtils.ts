import { Class, Unit } from "..";
import { RNG } from "../utils/math";
import { Trinkets, Classes, Weapons } from "../game/data";
import { Equipment } from "../game/Equipment/Equipment";
import {
	EQUIPMENT_SLOT,
	EQUIPMENT_TYPE,
	EquipmentData,
	EquipmentInstance,
} from "../game/Equipment/EquipmentTypes";
import { ShopUnit, ShopUnitInstance } from "./ShopUnit";
import { ShopEquipment, ShopEquipmentInstance } from "./ShopEquipment";

export function generateItemsFromTier(tier: number, { quantityPerItem = 3 }, type: EQUIPMENT_TYPE) {
	const items: EquipmentInstance[] = [];
	const itemDatabase = type === EQUIPMENT_TYPE.WEAPON ? Weapons : Trinkets;

	Object.keys(itemDatabase).forEach(key => {
		for (let i = 0; i < quantityPerItem; i++) {
			let item = new Equipment((itemDatabase as any)[key], tier).serialize();
			items.push(item);
		}
	});

	return items;
}

export function generateRandomItems({ quantityPerItem = 3 }, type: EQUIPMENT_TYPE) {
	const items: EquipmentInstance[] = [];
	const itemDatabase = type === EQUIPMENT_TYPE.WEAPON ? Weapons : Trinkets;

	Object.keys(itemDatabase).forEach(key => {
		for (let i = 0; i < quantityPerItem; i++) {
			let item = new Equipment((itemDatabase as any)[key], RNG.between(0, 5)).serialize();
			items.push(item);
		}
	});

	return items;
}

export function getUnitData(
	boardUnit: { id: string; name: string; equipment?: EquipmentInstance[] },
	owner: number,
	position: string,
) {
	const unit = new Unit(owner, parseInt(position));
	unit.setClass(new Class(Classes[boardUnit.name as keyof typeof Classes]));

	if (boardUnit?.equipment && boardUnit?.equipment?.length > 0) {
		boardUnit.equipment.forEach(equipmentData => {
			if (equipmentData.slots.includes(EQUIPMENT_SLOT.TRINKET)) {
				if (unit.equipmentManager.isSlotOccupied(EQUIPMENT_SLOT.TRINKET)) {
					unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.TRINKET_2);
				} else {
					unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.TRINKET);
				}
			} else if (equipmentData.slots.includes(EQUIPMENT_SLOT.TWO_HANDS)) {
				unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.TWO_HANDS);
			} else {
				if (!unit.equipmentManager.isSlotOccupied(EQUIPMENT_SLOT.MAIN_HAND)) {
					unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.MAIN_HAND);
				} else {
					if (
						unit.equipmentManager.canEquipOnSlot(
							new Equipment(equipmentData),
							EQUIPMENT_SLOT.OFF_HAND,
						)
					) {
						unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.OFF_HAND);
					} else {
						console.error(`getUnitData: Can't equip ${equipmentData.name} on offhand`);
					}
				}
			}
		});
	}

	const serializedUnit = unit.serialize();

	return serializedUnit;
}

export function generateRandomItem(tier: number, type: EQUIPMENT_TYPE) {
	const itemDatabase: { [key: string]: EquipmentData } =
		type === EQUIPMENT_TYPE.WEAPON ? Weapons : Trinkets;

	const keys = Object.keys(itemDatabase);
	const randomIndex = Math.floor(Math.random() * keys.length);
	const randomItemKey = keys[randomIndex];

	const randomItem = itemDatabase[randomItemKey];

	return new Equipment(randomItem, tier);
}

export function generateRandomUnitWithEquipment(tier: number) {
	const keys = Object.keys(Classes);
	const randomIndex = Math.floor(Math.random() * keys.length);
	const randomClassKey = keys[randomIndex];
	/* const randomClass = Classes[randomItemKey as keyof typeof Classes]; */

	return {
		class: randomClassKey as keyof typeof Classes,
		equipment: generateRandomItem(tier, EQUIPMENT_TYPE.WEAPON),
	};
}

export interface Shop {
	units: ShopUnitInstance[];
	weapons: ShopEquipmentInstance[];
	trinkets: ShopEquipmentInstance[];
}

export function generateShop(round: number) {
	if (round < 1 || round > 7) {
		throw new Error("generateShop: Invalid round number");
	}
	const roundTierMap: { [key: string]: { min: number; max: number } } = {
		"1": {
			min: 0,
			max: 1,
		},
		"2": {
			min: 0,
			max: 2,
		},
		"3": {
			min: 1,
			max: 2,
		},
		"4": {
			min: 1,
			max: 3,
		},
		"5": {
			min: 2,
			max: 4,
		},
		"6": {
			min: 3,
			max: 4,
		},
		"7": {
			min: 3,
			max: 5,
		},
	};

	const unitsOffered = 3;
	const weaponsOffered = 3;
	const trinketsOffered = 2;

	const shop: Shop = {
		units: [],
		weapons: [],
		trinkets: [],
	};

	for (let i = 0; i < unitsOffered; i++) {
		const tier = RNG.between(roundTierMap[round].min, roundTierMap[round].max);
		const unit = generateRandomUnitWithEquipment(tier);
		shop.units.push(new ShopUnit(unit.class, unit.equipment).serialize());
	}
	for (let i = 0; i < weaponsOffered; i++) {
		const tier = RNG.between(roundTierMap[round].min, roundTierMap[round].max);
		const item = generateRandomItem(tier, EQUIPMENT_TYPE.WEAPON);
		shop.weapons.push(new ShopEquipment(item).serialize());
	}
	for (let i = 0; i < trinketsOffered; i++) {
		const tier = RNG.between(roundTierMap[round].min, roundTierMap[round].max);
		const item = generateRandomItem(tier, EQUIPMENT_TYPE.WEAPON);
		shop.trinkets.push(new ShopEquipment(item).serialize());
	}

	return shop;
}
