import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { DroppableBoardSpace } from "./DroppableBoardSpace";
import { ArrowRightIcon } from "lucide-react";

function BoardContainer() {
	const { board } = useArenaQueries();

	if (!board) {
		return;
	}

	return (
		<div className="relative w-fit h-fit grid grid-cols-3 gap-5">
			{board.map(space => (
				<DroppableBoardSpace key={space.position} boardSpace={space} />
			))}

			<div className="font-sm text-zinc-200 pt-2.5 flex items-center gap-2 absolute font-mono bottom-0 right-1/2 translate-x-1/2 translate-y-full w-max">
				<ArrowRightIcon size={17} />
			</div>
		</div>
	);
}

export { BoardContainer };
