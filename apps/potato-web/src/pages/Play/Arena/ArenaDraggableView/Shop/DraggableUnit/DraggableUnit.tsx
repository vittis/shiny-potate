import { tierColorMap } from "@/components/MarkdownContent/MarkdownComponents";
import { MarkdownTooltip } from "@/components/MarkdownTooltip/MarkdownTooltip";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { UnitInfo } from "game-logic";
import { UnitTooltip } from "./UnitTooltip";

interface DraggableUnitInterface {
	id: string;
	unit: UnitInfo;
}

function DraggableUnit({ id, unit }: DraggableUnitInterface) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: id,
		data: {
			unit: {
				id,
				...unit,
			},
		},
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const { className, equipment } = unit;

	const unitEquips = equipment || [];

	return (
		<MarkdownTooltip content={<UnitTooltip unit={unit} />}>
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
						{unitEquips.map(equippedItem => (
							<div
								key={equippedItem.equip.id}
								className={cn(
									"border border-yellow-700 border-dashed rounded p-0.5 text-xs",
									tierColorMap[equippedItem.equip.tier],
								)}
							>
								{equippedItem.equip.name}{" "}
								<span className={cn("text-xs", tierColorMap[equippedItem.equip.tier])}>
									T{equippedItem.equip.tier}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</MarkdownTooltip>
	);
}

export { DraggableUnit };
