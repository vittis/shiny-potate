import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { BoardUnitInstance } from "game-logic";
import { DraggableBoardUnit } from "../Shop/DraggableUnit/DraggableBoardUnit";

interface DroppableBoardSpaceProps {
	boardSpace: { position: string; unit: BoardUnitInstance | null };
}

function DroppableBoardSpace({ boardSpace }: DroppableBoardSpaceProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: boardSpace.position,
		data: { position: boardSpace.position, unit: boardSpace.unit },
	});

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"h-[100px] w-[100px] rounded-md border border-zinc-700 transition-all duration-75",
				isOver && "bg-zinc-800",
				isOver && "scale-110",
			)}
		>
			{boardSpace.unit ? <DraggableBoardUnit boardUnit={boardSpace.unit} /> : null}
		</div>
	);
}

export { DroppableBoardSpace };
