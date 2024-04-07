import { EquipmentMarkdownContent } from "@/components/MarkdownContent/EquipmentMarkdownContent";
import { tierColorMap } from "@/components/MarkdownContent/MarkdownComponents";
import { MarkdownTooltip } from "@/components/MarkdownTooltip/MarkdownTooltip";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { ShopEquipmentInstance } from "game-logic";

interface DraggableShopEquipmentInterface {
	shopEquipment: ShopEquipmentInstance;
}

function DraggableShopEquipment({ shopEquipment }: DraggableShopEquipmentInterface) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: shopEquipment.id,
		data: { shopEquipment: shopEquipment },
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const { equipment, price } = shopEquipment;

	return (
		<div className="font-mono flex flex-col items-center">
			<div className="text-yellow-300">{price}</div>
			<MarkdownTooltip content={<EquipmentMarkdownContent equip={equipment} />}>
				<div
					ref={setNodeRef}
					style={style}
					{...listeners}
					{...attributes}
					className={cn(
						"w-[100px] h-[100px] rounded-md border border-zinc-700 relative bg-black transition-colors flex items-center justify-center",
						"border-dashed border-yellow-700 hover:border-yellow-600 w-auto h-auto p-1",
						tierColorMap[equipment.tier],
						isDragging && "z-30",
					)}
				>
					<div>
						{equipment.name}{" "}
						<span className={cn("text-xs", tierColorMap[equipment.tier])}>T{equipment.tier}</span>
					</div>
				</div>
			</MarkdownTooltip>
		</div>
	);
}

export { DraggableShopEquipment };
