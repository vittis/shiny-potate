import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { trpc } from "@/services/api/trpc";

function ArenaView() {
	const { data } = trpc.arena.my.useQuery();

	return (
		<ScrollArea className="h-full w-full px-4">
			<ScrollBar />
			<div className="relative">
				<div>opa</div>
			</div>
		</ScrollArea>
	);
}

export { ArenaView };
