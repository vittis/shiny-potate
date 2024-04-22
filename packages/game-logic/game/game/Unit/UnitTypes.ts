import { ShopEquipInstance } from "../../shop/ShopEquip";
import { POSITION } from "../BoardManager";
import { ClassNodeInstance, TalentTreeInstance } from "../Class/ClassTypes";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";

export interface EquippedShopEquip {
	slot: EQUIPMENT_SLOT;
	shopEquip: ShopEquipInstance;
}

export interface UnitInfo {
	className: string;
	talentTrees: TalentTreeInstance[];
	utilityNodes: ClassNodeInstance[];
	shopEquipment: EquippedShopEquip[];
	level: number;
	xp: number;
}

export interface BoardUnitInstance extends ShopUnitInstance {
	position: POSITION;
}

export interface ShopUnitInstance {
	id: string;
	price: number;
	unit: UnitInfo;
}
