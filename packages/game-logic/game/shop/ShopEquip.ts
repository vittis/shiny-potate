import { EquipmentInstance } from "..";
import { Equipment } from "../game/Equipment/Equipment";

export interface ShopEquipInstance {
	id: string;
	price: number;
	equip: EquipmentInstance;
}

// todo shared base ShopEntity?
export class ShopEquip {
	price: number;
	equip: Equipment;

	constructor(equipment: Equipment) {
		this.equip = equipment;
		this.price = this.calculatePrice();
	}

	calculatePrice() {
		return Math.max(2, this.equip.tier * 4 + Math.floor(Math.random() * 3));
	}

	serialize(): ShopEquipInstance {
		return {
			id: this.equip.id,
			price: this.price,
			equip: this.equip.serialize(),
		};
	}
}
