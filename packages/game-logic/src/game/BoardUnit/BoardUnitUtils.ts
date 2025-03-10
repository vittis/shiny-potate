import { BattleUnitInfo } from "../BattleUnit/BattleUnitTypes";
import { OWNER } from "../BoardManager/BoardManager";
import { BoardUnit } from "./BoardUnit";

export function generateBattleUnitInfo(boardUnit: BoardUnit, owner: OWNER): BattleUnitInfo {
	return {
		owner,
		packUnit: boardUnit.packUnit,
		equipment: boardUnit.equipment,
		abilities: boardUnit.abilities,
	};
}
