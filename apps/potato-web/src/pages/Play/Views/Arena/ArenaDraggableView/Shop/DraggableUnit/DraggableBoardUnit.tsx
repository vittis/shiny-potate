import { BoardUnitInstance } from "game-logic";
import { useDraggable } from "@dnd-kit/core";
import { DraggableUnitInfo } from "./DraggableUnitInfo";
import { useArenaIsUpdating } from "@/services/features/Arena/useArenaUpdate";

interface DraggableShopUnitInterface {
	boardUnit: BoardUnitInstance;
}

const DraggableBoardUnit = ({ boardUnit }: DraggableShopUnitInterface) => {
	// todo consider making a shared useArenaMutations to avoid having to do this
	const disabled = useArenaIsUpdating();

	const draggableData = useDraggable({
		id: boardUnit.id,
		data: {
			unit: boardUnit,
		},
		disabled,
	});

	return (
		<DraggableUnitInfo
			unitId={boardUnit.id}
			useDraggableData={draggableData}
			unitInfo={boardUnit.unit}
		/>
	);
};

export { DraggableBoardUnit };
