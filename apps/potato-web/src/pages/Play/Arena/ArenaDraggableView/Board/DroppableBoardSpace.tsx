import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

interface DroppableBoardSpaceProps {
	children?: React.ReactNode;
	boardSpace: { position: string; unit: any };
}

function DroppableBoardSpace({ children, boardSpace }: DroppableBoardSpaceProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: boardSpace.position,
		data: { position: boardSpace.position },
	});

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"w-[100px] h-[100px] rounded-md border border-zinc-700 transition-transform duration-75",
				isOver && "bg-zinc-800",
				isOver && "scale-110",
			)}
		>
			{children}
		</div>
	);
}

export { DroppableBoardSpace };