import { ShopUnitInstance } from "game-logic";
import { useDraggable } from "@dnd-kit/core";
import { DraggableUnitInfo } from "./DraggableUnitInfo";
import { useArenaIsUpdating } from "@/services/features/Arena/useArenaUpdate";

interface DraggableShopUnitInterface {
	shopUnit: ShopUnitInstance;
}

function DraggableShopUnit({ shopUnit }: DraggableShopUnitInterface) {
	const disabled = useArenaIsUpdating();

	const draggableData = useDraggable({
		id: shopUnit.id,
		data: {
			unit: shopUnit,
		},
		disabled,
	});

	const { price } = shopUnit;

	return (
		<div className="flex flex-col items-center font-mono">
			<div className="flex gap-1 text-yellow-300">{price}</div>
			<DraggableUnitInfo
				allowRemoveEquip={false}
				useDraggableData={draggableData}
				unit={shopUnit.unit}
			/>
		</div>
	);
}

export { DraggableShopUnit };
