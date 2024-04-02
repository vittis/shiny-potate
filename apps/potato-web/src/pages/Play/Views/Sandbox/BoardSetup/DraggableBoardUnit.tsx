import { tierColorMap } from "@/components/MarkdownContent/MarkdownComponents";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";

const DraggableBoardUnit = ({ children, id, unit, isClass, weaponTier, removeEquipment }: any) => {
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);

	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id,
		data: { unit }, // todo use this
	});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const unitEquips = unit?.equipment || [];
	const isWeapon = !isClass && !unit;

	const finalListeners = isTooltipOpen ? {} : listeners;
	const finalAttributes = isTooltipOpen ? {} : attributes;

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...finalListeners}
			{...finalAttributes}
			className={cn(
				"w-[100px] h-[100px] rounded-md border border-zinc-700 relative bg-black transition-colors flex items-center justify-center",
				isDragging && "z-30",
				isClass && "border-green-900 hover:border-green-700",
				!isClass &&
					!unit &&
					"border-dashed border-yellow-700 hover:border-yellow-600 w-auto h-auto p-1",
				isWeapon && tierColorMap[weaponTier],
			)}
		>
			<div>{children}</div>
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
	);
};

export { DraggableBoardUnit };
