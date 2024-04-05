import { POSITION } from "../BoardManager";
import { EquippedItemInstance } from "../Equipment/EquipmentManager";

export interface UnitInfo {
	className: string;
	equipment: EquippedItemInstance[];
}

export interface BoardUnitInstance extends UnitInfo {
	id: string;
	position: POSITION;
}
