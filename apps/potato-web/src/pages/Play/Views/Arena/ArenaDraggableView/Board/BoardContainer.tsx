import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { DroppableBoardSpace } from "./DroppableBoardSpace";
import { ArrowRightIcon } from "lucide-react";

function BoardContainer() {
	const { board } = useArenaQueries();

	if (!board) {
		return;
	}

	return (
		<div className="relative grid h-fit w-fit grid-cols-3 gap-5">
			{board.map(space => (
				<DroppableBoardSpace key={space.position} boardSpace={space} />
			))}

			<div className="font-sm absolute bottom-0 right-1/2 flex w-max translate-x-1/2 translate-y-full items-center gap-2 pt-2.5 font-mono text-zinc-200">
				<ArrowRightIcon size={17} />
			</div>
		</div>
	);
}

export { BoardContainer };
