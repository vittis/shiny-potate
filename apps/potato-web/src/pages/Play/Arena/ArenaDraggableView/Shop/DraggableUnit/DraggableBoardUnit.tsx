import { BoardUnitInstance } from "game-logic";
import { useDraggable } from "@dnd-kit/core";
import { DraggableUnitInfo } from "./DraggableUnitInfo";

interface DraggableShopUnitInterface {
	boardUnit: BoardUnitInstance;
}

function DraggableBoardUnit({ boardUnit }: DraggableShopUnitInterface) {
	const draggableData = useDraggable({
		id: boardUnit.id,
		data: {
			unit: boardUnit,
		},
	});

	return <DraggableUnitInfo useDraggableData={draggableData} unit={boardUnit.unit} />;
}

export { DraggableBoardUnit };
