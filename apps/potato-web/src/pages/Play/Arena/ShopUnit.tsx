import { BoardUnitMarkdownContent } from "@/components/MarkdownContent/BoardUnitMarkdownContent";
import { EquipmentMarkdownContent } from "@/components/MarkdownContent/EquipmentMarkdownContent";
import { tierColorMap } from "@/components/MarkdownContent/MarkdownComponents";
import { MarkdownContent } from "@/components/MarkdownContent/MarkdownContent";
import { MarkdownTooltip } from "@/components/MarkdownTooltip/MarkdownTooltip";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { ShopUnitInstance, getUnitData } from "game-logic";
import { CircleDollarSign } from "lucide-react";

interface ShopUnitInterface {
	shopUnit: ShopUnitInstance;
}

function ShopUnit({ shopUnit }: ShopUnitInterface) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: shopUnit.id,
		data: shopUnit,
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const { id, className, equipment, price } = shopUnit;

	const unitEquips = [equipment] || [];

	return (
		<div className="font-mono flex flex-col items-center">
			<div className="flex gap-1 text-yellow-300">{price}</div>
			<MarkdownTooltip
				content={
					<div className="relative">
						<BoardUnitMarkdownContent
							unit={getUnitData({ id, name: className, equipment: [equipment] }, 0, id) as any}
						/>
						<div className="translate-x-[104%] w-max absolute top-0 right-0 z-50 rounded-md border border-green-900 bg-popover text-popover-foreground shadow-md outline-none">
							<div className="relative">
								<MarkdownContent sourcePath={`Classes/${className}`} />

								<div className="translate-y-[105%] w-max absolute bottom-0 left-0 z-50 rounded-md border border-yellow-700 bg-popover text-popover-foreground shadow-md outline-none">
									<div className="relative">
										<EquipmentMarkdownContent equip={equipment} />
										{/* <div className="translate-y-[105%] w-max absolute bottom-0 left-0 z-50 rounded-md border border-yellow-700 bg-popover text-popover-foreground shadow-md outline-none">
											<div className="relative">
												<EquipmentMarkdownContent equip={equipment} />
											</div>
										</div> */}
									</div>
								</div>
							</div>
						</div>
					</div>
				}
			>
				<div
					ref={setNodeRef}
					style={style}
					{...listeners}
					{...attributes}
					className={cn(
						"font-mono w-[100px] h-[100px] rounded-md border border-zinc-700 relative bg-black transition-colors flex items-center justify-center",
						"border-green-900 hover:border-green-700",
						isDragging && "z-30",
					)}
				>
					<div>{className}</div>
					{unitEquips.length > 0 && (
						<div className="absolute top-0 right-0">
							{unitEquips.map(equip => (
								<div
									key={equip.id}
									className={cn(
										"border border-yellow-700 border-dashed rounded p-0.5 text-xs",
										tierColorMap[equip.tier],
									)}
								>
									{equip.name}{" "}
									<span className={cn("text-xs", tierColorMap[equip.tier])}>T{equip.tier}</span>
								</div>
							))}
						</div>
					)}
				</div>
			</MarkdownTooltip>
		</div>
	);
}

export { ShopUnit };
