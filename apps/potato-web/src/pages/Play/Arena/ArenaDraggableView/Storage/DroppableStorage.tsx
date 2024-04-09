import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { Storage } from "game-logic";
import { DraggableStorageUnit } from "../Shop/DraggableUnit/DraggableStorageUnit";
import { BoxIcon } from "lucide-react";
import { DraggableShopEquipment } from "../Shop/DraggableShopEquipment/DraggableShopEquipment";

interface DroppableStorageProps {
	storage: Storage;
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
				"relative h-[220px] w-fit min-w-[380px] rounded-md border border-zinc-700 p-2 transition-colors duration-150",
				isOver && "bg-zinc-800",
			)}
		>
			<div className="flex gap-4">
				{storage.units.length > 0 &&
					storage.units.map(unit => <DraggableStorageUnit key={unit.id} shopUnit={unit} />)}
			</div>

			<div className="mt-4 flex gap-4">
				{storage.equips.length > 0 &&
					storage.equips.map(shopEquip => (
						<DraggableShopEquipment key={shopEquip.id} shopEquip={shopEquip} hidePrice />
					))}
			</div>

			<div className="absolute bottom-0 right-1/2 flex translate-x-1/2 translate-y-full items-center gap-2 pt-2 font-mono text-zinc-300">
				Storage <BoxIcon size={16} />
			</div>
		</div>
	);
}

export { DroppableStorage };
