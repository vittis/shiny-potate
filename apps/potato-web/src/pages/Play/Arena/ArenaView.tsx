import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function ArenaView() {
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
