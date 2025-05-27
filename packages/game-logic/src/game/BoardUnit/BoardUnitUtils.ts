import { BattleUnitInfo } from "@/game/BattleUnit/BattleUnitTypes";
import { OWNER } from "@/game/BoardManager/BoardManager";
import { BoardUnit } from "@/game/BoardUnit/BoardUnit";

export function generateBattleUnitInfo(boardUnit: BoardUnit, owner: OWNER): BattleUnitInfo {
	return {
		owner,
		packUnit: boardUnit.packUnit,
		equipment: boardUnit.equipment,
		abilities: boardUnit.abilities,
	};
}
