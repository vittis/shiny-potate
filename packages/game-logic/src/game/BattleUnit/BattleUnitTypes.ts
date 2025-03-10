import { Ability } from "../Ability/Ability";
import { OWNER } from "../BoardManager/BoardManager";
import { EquippedItem } from "../Equipment/EquipmentManager";
import { PackUnit } from "../PackUnit/PackUnit";

export type BattleUnitInfo = {
	owner: OWNER;
	packUnit: PackUnit;
	equipment: EquippedItem[];
	abilities: Ability[];
};
