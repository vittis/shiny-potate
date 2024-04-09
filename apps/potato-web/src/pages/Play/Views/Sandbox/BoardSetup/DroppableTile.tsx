import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

function DroppableTile({ children, id }: any) {
	const { isOver, setNodeRef } = useDroppable({
		id: id,
	});

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"h-[100px] w-[100px] rounded-md border border-zinc-700 transition-transform duration-75",
				isOver && "bg-zinc-800",
				isOver && "scale-110",
			)}
		>
			{children}
		</div>
	);
}

export { DroppableTile };
