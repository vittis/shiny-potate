import { BoardUnit } from "../BoardUnit/BoardUnit";
import { TAG } from "./TagTypes";

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
