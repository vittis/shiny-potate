import { MarkdownTooltip } from "@/components/MarkdownTooltip/MarkdownTooltip";
import type { UnitInfo } from "game-logic";
import { UnitTooltip } from "./UnitTooltip";
import { tierColorMap } from "@/components/MarkdownContent/MarkdownComponents";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { useMemo } from "react";

interface UnitInfoProps {
	unitId: string;
	unitInfo: UnitInfo;
	useDraggableData: ReturnType<typeof useDraggable>;
	allowRemoveEquip?: boolean;
}

const DraggableUnitInfo = ({
	unitId,
	useDraggableData,
	unitInfo,
	allowRemoveEquip,
}: UnitInfoProps) => {
	const { attributes, listeners, setNodeRef, transform, isDragging, node } = useDraggableData;

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const { className, shopEquipment } = unitInfo;

	const isDisabled = node.current?.ariaDisabled === "true";

	const unitContent = useMemo(() => {
		return (
			<div
				ref={setNodeRef}
				className={cn(
					"group relative flex h-[100px] w-[100px] items-center justify-center rounded-md border border-zinc-700 bg-black font-mono transition-opacity",
					"border-green-900 aria-disabled:cursor-default aria-disabled:opacity-50",
					isDragging && "z-30",
					!isDisabled && "hover:border-green-700",
				)}
				style={style}
				{...listeners}
				{...attributes}
			>
				{shopEquipment.length > 0 && (
					<div className="absolute right-0 top-0">
						{shopEquipment.map(({ shopEquip: { equip } }) => (
							<div
								key={equip.id}
								className={cn(
									"rounded border border-dashed border-yellow-700 p-0.5 text-center text-xs",
									tierColorMap[equip.tier],
								)}
							>
								{equip.name}{" "}
								<span className={cn("text-xs", tierColorMap[equip.tier])}>T{equip.tier}</span>
							</div>
						))}
					</div>
				)}
				<div
					className={cn(
						"text-md relative z-[2] flex flex-col items-center justify-center rounded bg-input px-1",
						!isDisabled && "group-aria-expanded:animate-rainbow-river",
					)}
				>
					<div>{className}</div>
					<div className="text-xs text-sky-300">Lv {unitInfo.level}</div>
				</div>
			</div>
		);
	}, [setNodeRef, style, listeners, attributes, isDragging, isDisabled, shopEquipment, className]);

	if (isDragging) {
		return <div>{unitContent}</div>;
	}

	return (
		<MarkdownTooltip
			forceClose={isDragging}
			content={
				<UnitTooltip unitId={unitId} allowRemoveEquip={allowRemoveEquip} unitInfo={unitInfo} />
			}
		>
			{unitContent}
		</MarkdownTooltip>
	);
};

export { DraggableUnitInfo };
