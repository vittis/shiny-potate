import { useDraggable } from "@dnd-kit/core";
import { ShopUnitInstance } from "game-logic";
import { DraggableUnitInfo } from "./DraggableUnitInfo";

interface DraggableStorageUnitInterface {
	shopUnit: ShopUnitInstance;
}

function DraggableStorageUnit({ shopUnit }: DraggableStorageUnitInterface) {
	const draggableData = useDraggable({
		id: shopUnit.id,
		data: {
			unit: shopUnit,
		},
	});

	return <DraggableUnitInfo useDraggableData={draggableData} unit={shopUnit.unit} />;
}

export { DraggableStorageUnit };
