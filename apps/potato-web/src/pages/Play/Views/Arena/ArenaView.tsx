import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { TooltipSettigs } from "@/components/MarkdownTooltip/TooltipSettings";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { useArenaMutations } from "@/services/features/Arena/useArenaMutations";
import { cn } from "@/lib/utils";
import { GiSwordsEmblem } from "react-icons/gi";
import { UnlockButton } from "@/components/ui/buttonUnlock";
import { useArenaUpdate } from "@/services/features/Arena/useArenaUpdate";
import { ArenaInfo } from "./ArenaInfo";
import { ArenaDraggableView } from "./ArenaDraggableView/ArenaDraggableView";
import { ArenaActionButtons } from "./ArenaActionButtons";

function ArenaView() {
	useArenaUpdate();

	const { currentRun, shop, isFetching, isRefetching, error, isPending } = useArenaQueries();

	const { newRun, newRunIsPending } = useArenaMutations();

	/* if (isPending) {
		return <Loader2 className="animate-spin mx-auto w-80 my-20" />;
	} */

	if (error) {
		return <div>{error?.message || "Could not fetch arena run :("}</div>;
	}

	const isLoading = isRefetching || newRunIsPending;

	return (
		<>
			<div className="relative">
				<div className="absolute right-2 top-1/2 -translate-y-1/2">
					<TooltipSettigs />
				</div>
				<div className="breadcrumbs flex h-[52px] items-center px-4">
					<ul>
						<li>
							<h1 className="text-lg font-bold">Play</h1>
						</li>
						<li>
							<h2 className="text-md font-bold text-muted-foreground">Arena</h2>
						</li>
					</ul>
				</div>
			</div>

			<Separator />

			<ScrollArea
				className={cn("relative h-full w-full px-4", !currentRun && "animate-gray-fluff")}
			>
				<ScrollBar />

				{isPending && <Loader2 className="mx-auto my-20 w-80 animate-spin" />}

				<div className="absolute right-4 top-4 flex gap-2">
					<ArenaActionButtons />
				</div>

				{!currentRun && !isPending && (
					<div className="fadeInTop mt-32 flex w-full items-center justify-center ease-out">
						<UnlockButton
							onClick={() => newRun()}
							isLoading={isLoading}
							icon={<GiSwordsEmblem className="text-neutral-200" size={34} />}
							size="lg"
						>
							Enter The Arena
						</UnlockButton>
					</div>
				)}

				{currentRun && (
					<div className="mt-4">
						<ArenaInfo />
						{shop && <ArenaDraggableView shop={shop} />}
					</div>
				)}
			</ScrollArea>
		</>
	);
}

export { ArenaView };
