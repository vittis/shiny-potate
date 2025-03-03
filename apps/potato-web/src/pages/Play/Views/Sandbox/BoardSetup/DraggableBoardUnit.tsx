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
				"relative flex h-[100px] w-[100px] items-center justify-center rounded-md border border-zinc-700 bg-black transition-colors",
				isDragging && "z-30",
				isClass && "border-green-900 hover:border-green-700",
				!isClass &&
					!unit &&
					"h-auto w-auto border-dashed border-yellow-700 p-1 hover:border-yellow-600",
				isWeapon && tierColorMap[weaponTier],
			)}
		>
			<div>{children}</div>
			{unitEquips.length > 0 && (
				<div className="absolute right-0 top-0">
					{unitEquips.map(equip => (
						<div
							key={equip.id}
							className={cn(
								"rounded border border-dashed border-yellow-700 p-0.5 text-xs",
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
