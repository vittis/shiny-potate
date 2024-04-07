import { ShopUnitInstance } from "game-logic";
import { useDraggable } from "@dnd-kit/core";
import { DraggableUnitInfo } from "./DraggableUnitInfo";

interface DraggableShopUnitInterface {
	shopUnit: ShopUnitInstance;
}

function DraggableShopUnit({ shopUnit }: DraggableShopUnitInterface) {
	const draggableData = useDraggable({
		id: shopUnit.id,
		data: {
			unit: shopUnit,
		},
	});

	const { price } = shopUnit;

	return (
		<div className="font-mono flex flex-col items-center">
			<div className="flex gap-1 text-yellow-300">{price}</div>
			<DraggableUnitInfo useDraggableData={draggableData} unit={shopUnit.unit} />
		</div>
	);
}

export { DraggableShopUnit };
