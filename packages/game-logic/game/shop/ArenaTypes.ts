import { BoardUnitInstance, ShopUnitInstance } from "../game/Unit/UnitTypes";
import { ShopEquipInstance } from "./ShopEquip";

export interface Shop {
	units: ShopUnitInstance[];
	weapons: ShopEquipInstance[];
	trinkets: ShopEquipInstance[];
}

export interface Storage {
	units: ShopUnitInstance[];
	equips: ShopEquipInstance[];
}

interface BoardSpace {
	position: string;
	unit: BoardUnitInstance | null;
}

export type Board = BoardSpace[];
