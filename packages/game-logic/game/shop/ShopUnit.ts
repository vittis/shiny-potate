import { Classes, ShopEquipmentData } from "..";
import { ShopEquipment } from "../game/Equipment/ShopEquipment";

// todo delete this and refactor kek
export class ShopUnit {
	price!: number;
	shopEquipmentData: ShopEquipment;
	className: keyof typeof Classes;

	constructor(className: keyof typeof Classes, shopEquipmentData: ShopEquipment) {
		this.shopEquipmentData = shopEquipmentData;
		this.price = this.calculatePrice();
		this.className = className;
	}

	calculatePrice() {
		return Math.max(2, this.shopEquipmentData.tier * 4) + 5;
	}
}
