import { ShopEquipInstance } from "../../shop/ShopEquip";
import { POSITION } from "../BoardManager";
import { EquippedItemInstance } from "../Equipment/EquipmentManager";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";

export interface EquippedShopEquip {
	slot: EQUIPMENT_SLOT;
	shopEquip: ShopEquipInstance;
}

export interface UnitInfo {
	className: string;
	shopEquipment: EquippedShopEquip[];
}

export interface BoardUnitInstance extends ShopUnitInstance {
	position: POSITION;
}

export interface ShopUnitInstance {
	id: string;
	price: number;
	unit: UnitInfo;
}
