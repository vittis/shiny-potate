import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { ShopEquipInstance, ShopUnitInstance } from "game-logic";
import { DraggableStorageUnit } from "../Shop/DraggableUnit/DraggableStorageUnit";
import { BoxIcon } from "lucide-react";
import { DraggableShopEquipment } from "../Shop/DraggableShopEquipment/DraggableShopEquipment";

interface DroppableStorageProps {
	storage: { units: ShopUnitInstance[]; equips: ShopEquipInstance[] };
}

function DroppableStorage({ storage }: DroppableStorageProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: "storage",
		data: { units: storage.units, equips: storage.equips },
	});

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"relative min-w-[380px] w-fit h-[220px] rounded-md border border-zinc-700 transition-colors duration-150 p-2",
				isOver && "bg-zinc-800",
			)}
		>
			<div className="flex gap-4">
				{storage.units.length > 0 &&
					storage.units.map(unit => <DraggableStorageUnit key={unit.id} shopUnit={unit} />)}
			</div>

			<div className="flex gap-4 mt-4">
				{storage.equips.length > 0 &&
					storage.equips.map(shopEquip => (
						<DraggableShopEquipment key={shopEquip.id} shopEquip={shopEquip} hidePrice />
					))}
			</div>

			<div className="pt-2 text-zinc-300 flex items-center gap-2 absolute font-mono bottom-0 right-1/2 translate-x-1/2 translate-y-full">
				Storage <BoxIcon size={16} />
			</div>
		</div>
	);
}

export { DroppableStorage };
