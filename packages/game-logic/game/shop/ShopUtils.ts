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
import { ShopUnit } from "./ShopUnit";
import { ShopEquip, ShopEquipInstance } from "./ShopEquip";
import { ShopUnitInstance, UnitInfo } from "../game/Unit/UnitTypes";
import { Shop } from "./ArenaTypes";

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

// todo to receive EquippedItem with slot
export function getUnitData(
	boardUnit: { id: string; name: string; equipment?: EquipmentInstance[] },
	owner: number,
	position: string,
): Unit {
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
						throw new Error(`getUnitData: Can't equip ${equipmentData.name} on offhand`);
					}
				}
			}
		});
	}

	const serializedUnit = unit.serialize();

	return unit;
}

export function generateRandomItem(tier: number, type: EQUIPMENT_TYPE) {
	const itemDatabase: { [key: string]: EquipmentData } =
		type === EQUIPMENT_TYPE.WEAPON ? Weapons : Trinkets;

	const keys = Object.keys(itemDatabase);
	const randomIndex = Math.floor(Math.random() * keys.length);
	const randomItemKey = keys[randomIndex];

	const randomItem = itemDatabase[randomItemKey];

	const equip = new Equipment(randomItem, tier);

	return new ShopEquip(equip);
}

// todo equip stuff?
export function generateRandomUnitWithEquipment(tier: number): UnitInfo {
	const keys = Object.keys(Classes);
	const randomIndex = Math.floor(Math.random() * keys.length);
	const randomClassKey = keys[randomIndex];

	const unit = new Unit(0, 0);
	unit.setClass(new Class(Classes[randomClassKey as keyof typeof Classes]));

	return {
		className: randomClassKey as keyof typeof Classes,
		talentTree: unit.classManager.class.serialize().talentTree,
		shopEquipment: [
			{
				slot: EQUIPMENT_SLOT.MAIN_HAND,
				shopEquip: generateRandomItem(tier, EQUIPMENT_TYPE.WEAPON).serialize(),
			},
		],
	};
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

	const unitsOffered = 4;
	const weaponsOffered = 5;
	const trinketsOffered = 3;

	const shop: Shop = {
		units: [],
		weapons: [],
		trinkets: [],
	};

	for (let i = 0; i < unitsOffered; i++) {
		const tier = RNG.between(roundTierMap[round].min, roundTierMap[round].max);
		const unit = generateRandomUnitWithEquipment(0);
		shop.units.push(new ShopUnit(unit).serialize());
	}
	for (let i = 0; i < weaponsOffered; i++) {
		const tier = RNG.between(roundTierMap[round].min, roundTierMap[round].max);
		const item = generateRandomItem(tier, EQUIPMENT_TYPE.WEAPON);
		shop.weapons.push(item.serialize());
	}
	for (let i = 0; i < trinketsOffered; i++) {
		const tier = RNG.between(roundTierMap[round].min, roundTierMap[round].max);
		const item = generateRandomItem(tier, EQUIPMENT_TYPE.TRINKET);
		shop.trinkets.push(item.serialize());
	}

	return shop;
}
