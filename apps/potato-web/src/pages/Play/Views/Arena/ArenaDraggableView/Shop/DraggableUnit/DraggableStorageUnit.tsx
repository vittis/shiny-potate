import { useDraggable } from "@dnd-kit/core";
import { ShopUnitInstance } from "game-logic";
import { DraggableUnitInfo } from "./DraggableUnitInfo";
import { useArenaIsUpdating } from "@/services/features/Arena/useArenaUpdate";

interface DraggableStorageUnitInterface {
	shopUnit: ShopUnitInstance;
}

function DraggableStorageUnit({ shopUnit }: DraggableStorageUnitInterface) {
	const disabled = useArenaIsUpdating();

	const draggableData = useDraggable({
		id: shopUnit.id,
		data: {
			unit: shopUnit,
		},
		disabled,
	});

	return <DraggableUnitInfo useDraggableData={draggableData} unit={shopUnit.unit} />;
}

export { DraggableStorageUnit };
