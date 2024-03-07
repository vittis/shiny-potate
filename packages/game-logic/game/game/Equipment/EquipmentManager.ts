import { Ability } from "../Ability/Ability";
import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { Equipment } from "./Equipment";
import { EQUIPMENT_SLOT } from "./EquipmentTypes";

export interface EquippedItem {
	slot: EQUIPMENT_SLOT;
	equip: Equipment;
}

export class EquipmentManager {
	equips: EquippedItem[] = [];

	constructor() {}

	equip(equip: Equipment, slot: EQUIPMENT_SLOT) {
		if (!this.canEquipOnSlot(equip, slot)) {
			throw Error("EquipmentManager: CANT EQUIP ON THIS SLOT MAN: " + slot + " " + equip.data.name);
		} else if (this.isSlotOccupied(slot)) {
			throw Error(
				"EquipmentManager: ALREADY EQUIPPED THIS SLOT MAN: " + slot + " " + equip.data.name,
			);
		}

		const item = {
			slot,
			equip,
		} as EquippedItem;
		this.equips.push(item);

		return item;
	}

	unequip(slot: EQUIPMENT_SLOT): EquippedItem[] {
		let unequipSlots = [slot];

		if (slot == EQUIPMENT_SLOT.TWO_HANDS) {
			unequipSlots = [slot, EQUIPMENT_SLOT.MAIN_HAND, EQUIPMENT_SLOT.OFF_HAND];
		} else if (slot == EQUIPMENT_SLOT.MAIN_HAND || EQUIPMENT_SLOT.OFF_HAND) {
			unequipSlots = [slot, EQUIPMENT_SLOT.TWO_HANDS];
		}

		const unequippedItems = this.equips.filter(e => unequipSlots.includes(e.slot));
		if (unequippedItems.length == 0) {
			throw Error("EquipmentManager: NO EQUIP IN THIS SLOT MAN " + slot);
		}

		this.equips = this.equips.filter(e => !unequipSlots.includes(e.slot));

		return unequippedItems;
	}

	isSlotOccupied(slot: EQUIPMENT_SLOT): boolean {
		if (slot == EQUIPMENT_SLOT.TWO_HANDS) {
			return !!this.equips.find(e =>
				[slot, EQUIPMENT_SLOT.MAIN_HAND, EQUIPMENT_SLOT.OFF_HAND].includes(e.slot),
			);
		} else if (slot == EQUIPMENT_SLOT.MAIN_HAND || EQUIPMENT_SLOT.OFF_HAND) {
			return !!this.equips.find(e => [slot, EQUIPMENT_SLOT.TWO_HANDS].includes(e.slot));
		}

		return !!this.equips.find(e => e.slot === slot);
	}

	canEquipOnSlot(equip: Equipment, equipSlot: EQUIPMENT_SLOT): boolean {
		let slot = equipSlot;
		if (slot === EQUIPMENT_SLOT.TRINKET_2) slot = EQUIPMENT_SLOT.TRINKET;

		return equip.data.slots.includes(slot);
	}
}
