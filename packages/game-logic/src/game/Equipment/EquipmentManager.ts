import { Equipment } from "@/game/Equipment/Equipment";
import { EQUIPMENT_SLOT } from "@/game/Equipment/EquipmentTypes";

export type EquippedItem = {
	slot: EQUIPMENT_SLOT;
	equipment: Equipment;
};

export class EquipmentManager {
	equipments: EquippedItem[] = [];

	constructor() {}

	equip(equipment: Equipment, slot: EQUIPMENT_SLOT) {
		if (!this.canEquipOnSlot(equipment, slot)) {
			throw Error(
				"EquipmentManager: equip - CANT EQUIP ON THIS SLOT MAN: " +
					slot +
					" " +
					equipment.data.name,
			);
		} else if (this.isSlotOccupied(slot)) {
			throw Error(
				"EquipmentManager: equip - ALREADY EQUIPPED THIS SLOT MAN: " +
					slot +
					" " +
					equipment.data.name,
			);
		}

		const item = {
			slot,
			equipment,
		} as EquippedItem;

		this.equipments.push(item);
	}

	unequip(slot: EQUIPMENT_SLOT) {
		const unequippedItems = this.equipments.find(e => e.slot == slot);

		if (!unequippedItems) {
			throw Error("EquipmentManager: unequip - NO EQUIP IN THIS SLOT MAN " + slot);
		}

		this.equipments = this.equipments.filter(e => e.slot != slot);

		// maybe return unequipped item?
	}

	isSlotOccupied(slot: EQUIPMENT_SLOT): boolean {
		return !!this.equipments.find(e => e.slot == slot);
	}

	canEquipOnSlot(equipment: Equipment, slot: EQUIPMENT_SLOT): boolean {
		return equipment.slots.includes(slot);
	}

	getEquipmentById(id: string): EquippedItem | undefined {
		return this.equipments.find(e => e.equipment.id == id);
	}
}
