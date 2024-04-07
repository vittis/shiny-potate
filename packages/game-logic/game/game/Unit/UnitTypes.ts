import { POSITION } from "../BoardManager";
import { EquippedItemInstance } from "../Equipment/EquipmentManager";

export interface UnitInfo {
	className: string;
	equipment: EquippedItemInstance[];
}

export interface BoardUnitInstance extends ShopUnitInstance {
	position: POSITION;
}

export interface ShopUnitInstance {
	id: string;
	price: number;
	unit: UnitInfo;
}
