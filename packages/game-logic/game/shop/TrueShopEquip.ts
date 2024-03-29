import { ShopEquipment } from "../game/Equipment/ShopEquipment";

// todo delete this and refactor kek
export class TrueShopEquip {
	price!: number;
	shopEquipmentData: ShopEquipment;

	constructor(shopEquipmentData: ShopEquipment) {
		this.shopEquipmentData = shopEquipmentData;
		this.price = this.calculatePrice();
	}

	calculatePrice() {
		return Math.max(2, this.shopEquipmentData.tier * 4);
	}
}
