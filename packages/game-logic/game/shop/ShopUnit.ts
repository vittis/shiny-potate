import { nanoid } from "nanoid";
import { Classes, EquipmentInstance } from "..";
import { Equipment } from "../game/Equipment/Equipment";
import { EquippedItem, EquippedItemInstance } from "../game/Equipment/EquipmentManager";

export interface ShopUnitInstance {
	id: string;
	price: number;
	className: keyof typeof Classes;
	equipment: EquippedItemInstance[];
}

// todo shared base ShopEntity?
export class ShopUnit {
	id: string;
	price: number;
	equipment: EquippedItem[];
	className: keyof typeof Classes;

	constructor(className: keyof typeof Classes, equipment: EquippedItem[]) {
		this.equipment = equipment;
		this.price = this.calculatePrice();
		this.className = className;
		this.id = nanoid(8);
	}

	calculatePrice() {
		// todo take in account the other equip
		return Math.max(2, this.equipment[0].equip.tier * 4) + 4 + Math.floor(Math.random() * 4);
	}

	serialize(): ShopUnitInstance {
		return {
			id: this.id,
			price: this.price,
			className: this.className,
			equipment: this.equipment.map(e => ({ slot: e.slot, equip: e.equip.serialize() })),
		};
	}
}
