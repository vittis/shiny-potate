import { nanoid } from "nanoid";
import { ShopUnitInstance, UnitInfo } from "../game/Unit/UnitTypes";

export class ShopUnit {
	id: string;
	price: number;
	unit: UnitInfo;

	constructor(unit: UnitInfo) {
		this.unit = unit;
		this.price = this.calculatePrice();
		this.id = nanoid(8);
	}

	calculatePrice() {
		// todo take in account other equips
		return (
			Math.max(2, this.unit.shopEquipment[0].shopEquip.equip.tier * 4) +
			4 +
			Math.floor(Math.random() * 4)
		);
	}

	serialize(): ShopUnitInstance {
		return {
			id: this.id,
			price: this.price,
			unit: this.unit,
		};
	}
}
