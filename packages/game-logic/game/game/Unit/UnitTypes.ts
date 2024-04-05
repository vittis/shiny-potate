import { POSITION } from "../BoardManager";
import { EquippedItemInstance } from "../Equipment/EquipmentManager";

export interface UnitInstance {
	id: string;
	className: string;
	position: POSITION;
	equipment: EquippedItemInstance[];
}
