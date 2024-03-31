import { Classes } from "..";
import { Equipment } from "../game/Equipment/Equipment";

// todo delete this and refactor kek
export class ShopUnit {
	price!: number;
	equipmentData: Equipment;
	className: keyof typeof Classes;

	constructor(className: keyof typeof Classes, shopEquipmentData: Equipment) {
		this.equipmentData = shopEquipmentData;
		this.price = this.calculatePrice();
		this.className = className;
	}

	calculatePrice() {
		return Math.max(2, this.equipmentData.tier * 4) + 5;
	}
}
