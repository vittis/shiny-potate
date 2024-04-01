import { EquipmentInstance } from "..";
import { Equipment } from "../game/Equipment/Equipment";

export interface ShopEquipmentInstance {
	id: string;
	price: number;
	equipment: EquipmentInstance;
}

// todo shared base ShopEntity?
export class ShopEquipment {
	price: number;
	equipment: Equipment;

	constructor(equipment: Equipment) {
		this.equipment = equipment;
		this.price = this.calculatePrice();
	}

	calculatePrice() {
		return Math.max(2, this.equipment.tier * 4 + Math.floor(Math.random() * 3));
	}

	serialize(): ShopEquipmentInstance {
		return {
			id: this.equipment.id,
			price: this.price,
			equipment: this.equipment.serialize(),
		};
	}
}
