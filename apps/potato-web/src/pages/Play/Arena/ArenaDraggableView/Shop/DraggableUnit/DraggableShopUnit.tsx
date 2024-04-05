import { ShopUnitInstance } from "game-logic";
import { DraggableUnit } from "./DraggableUnit";

interface DraggableShopUnitInterface {
	shopUnit: ShopUnitInstance;
}

function DraggableShopUnit({ shopUnit }: DraggableShopUnitInterface) {
	const { price } = shopUnit;

	return (
		<div className="font-mono flex flex-col items-center">
			<div className="flex gap-1 text-yellow-300">{price}</div>
			<DraggableUnit id={shopUnit.id} unit={shopUnit.unit} />
		</div>
	);
}

export { DraggableShopUnit };
