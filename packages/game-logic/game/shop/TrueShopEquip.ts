import { Equipment } from "../game/Equipment/Equipment";

// todo delete this and refactor kek
export class TrueShopEquip {
	price!: number;
	equipmentData: Equipment;

	constructor(shopEquipmentData: Equipment) {
		this.equipmentData = shopEquipmentData;
		this.price = this.calculatePrice();
	}

	calculatePrice() {
		return Math.max(2, this.equipmentData.tier * 4);
	}
}
