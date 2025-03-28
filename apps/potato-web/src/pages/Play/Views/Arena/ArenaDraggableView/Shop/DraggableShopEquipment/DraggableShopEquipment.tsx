import { EquipmentMarkdownContent } from "@/components/MarkdownContent/EquipmentMarkdownContent";
import { tierColorMap } from "@/components/MarkdownContent/MarkdownComponents";
import { MarkdownTooltip } from "@/components/MarkdownTooltip/MarkdownTooltip";
import { cn } from "@/lib/utils";
import { useArenaIsUpdating } from "@/services/features/Arena/useArenaUpdate";
import { useDraggable } from "@dnd-kit/core";
import { ShopEquipInstance } from "game-logic";

interface DraggableShopEquipmentInterface {
	shopEquip: ShopEquipInstance;
	hidePrice?: boolean;
}

function DraggableShopEquipment({ shopEquip, hidePrice = false }: DraggableShopEquipmentInterface) {
	const disabled = useArenaIsUpdating();

	const { attributes, listeners, setNodeRef, transform, isDragging, node } = useDraggable({
		id: shopEquip.id,
		data: { shopEquip },
		disabled,
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const { equip, price } = shopEquip;

	const isDisabled = node.current?.ariaDisabled === "true";

	if (hidePrice) {
		return (
			<MarkdownTooltip content={<EquipmentMarkdownContent equip={equip} />}>
				<div
					ref={setNodeRef}
					style={style}
					{...listeners}
					{...attributes}
					className={cn(
						"relative flex h-[100px] w-[100px] items-center justify-center rounded-md border border-zinc-700 bg-black",
						"h-auto w-auto border-dashed border-yellow-700 p-1 transition-opacity aria-disabled:cursor-default aria-disabled:opacity-50",
						tierColorMap[equip.tier],
						isDragging && "z-30",
						!isDisabled && "transition-colors hover:border-yellow-600",
					)}
				>
					<div>
						{equip.name}{" "}
						<span className={cn("text-xs", tierColorMap[equip.tier])}>T{equip.tier}</span>
					</div>
				</div>
			</MarkdownTooltip>
		);
	}

	return (
		<div className="flex flex-col items-center font-mono">
			<div className="text-yellow-300">{price}</div>
			<MarkdownTooltip content={<EquipmentMarkdownContent equip={equip} />}>
				<div
					ref={setNodeRef}
					style={style}
					{...listeners}
					{...attributes}
					className={cn(
						"relative flex h-[100px] w-[100px] items-center justify-center rounded-md border border-zinc-700 bg-black",
						"h-auto w-auto border-dashed border-yellow-700 p-1 aria-disabled:cursor-default aria-disabled:opacity-50 aria-disabled:transition-opacity",
						tierColorMap[equip.tier],
						isDragging && "z-30",
						!isDisabled && "transition-colors hover:border-yellow-600",
					)}
				>
					<div>
						{equip.name}{" "}
						<span className={cn("text-xs", tierColorMap[equip.tier])}>T{equip.tier}</span>
					</div>
				</div>
			</MarkdownTooltip>
		</div>
	);
}

export { DraggableShopEquipment };
