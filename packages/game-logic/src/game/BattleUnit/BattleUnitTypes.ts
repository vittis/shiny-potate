import { Ability } from "@/game/Ability/Ability";
import { OWNER } from "@/game/BoardManager/BoardManager";
import { EquippedItem } from "@/game/Equipment/EquipmentManager";
import { PackUnit } from "@/game/PackUnit/PackUnit";

export type BattleUnitInfo = {
	owner: OWNER;
	packUnit: PackUnit;
	equipment: EquippedItem[];
	abilities: Ability[];
};
