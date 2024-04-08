import { BoardUnitInstance } from "game-logic";
import { useDraggable } from "@dnd-kit/core";
import { DraggableUnitInfo } from "./DraggableUnitInfo";
import { memo } from "react";

interface DraggableShopUnitInterface {
	boardUnit: BoardUnitInstance;
}

const DraggableBoardUnit = memo(({ boardUnit }: DraggableShopUnitInterface) => {
	const draggableData = useDraggable({
		id: boardUnit.id,
		data: {
			unit: boardUnit,
		},
	});

	return <DraggableUnitInfo useDraggableData={draggableData} unit={boardUnit.unit} />;
});

export { DraggableBoardUnit };
