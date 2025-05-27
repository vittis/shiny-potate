import { BoardUnit } from "@/game/BoardUnit/BoardUnit";
import { TAG } from "@/game/Tag/TagTypes";

export function getTagFromSourceId(boardUnit: BoardUnit, sourceId: string): TAG[] {
	if (boardUnit.packUnit.id === sourceId) {
		return boardUnit.packUnit.tags;
	}

	const equipment = boardUnit.equipment.find(equip => equip.equipment.id === sourceId);

	if (equipment) {
		return equipment.equipment.tags;
	}

	throw Error(
		`TagUtils: getTagFromSourceId - No source found on BoardUnit ${boardUnit.id} for sourceId ${sourceId}`,
	);
}
