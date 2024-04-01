import { nanoid } from "nanoid";
import { Classes, EquipmentInstance } from "..";
import { Equipment } from "../game/Equipment/Equipment";

export interface ShopUnitInstance {
	id: string;
	price: number;
	class: keyof typeof Classes;
	equipment: EquipmentInstance;
}

// todo shared base ShopEntity?
export class ShopUnit {
	id: string;
	price: number;
	equipment: Equipment;
	className: keyof typeof Classes;

	constructor(className: keyof typeof Classes, equipment: Equipment) {
		this.equipment = equipment;
		this.price = this.calculatePrice();
		this.className = className;
		this.id = nanoid(8);
	}

	calculatePrice() {
		return Math.max(2, this.equipment.tier * 4) + 4 + Math.floor(Math.random() * 4);
	}

	serialize(): ShopUnitInstance {
		return {
			id: this.id,
			price: this.price,
			class: this.className,
			equipment: this.equipment.serialize(),
		};
	}
}
