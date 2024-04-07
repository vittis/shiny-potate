import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/services/api/trpc";
import { ArrowRight, ArrowRightIcon, Loader2, Loader2Icon, SwordsIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/services/api/queryClient";
import { ArenaDraggableView } from "./ArenaDraggableView/ArenaDraggableView";
import { TooltipSettigs } from "@/components/MarkdownTooltip/TooltipSettings";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { ArenaActionButtons } from "./ArenaActionButtons";
import { useArenaMutations } from "@/services/features/Arena/useArenaMutations";
import { cn } from "@/lib/utils";
import { GiSwordsEmblem } from "react-icons/gi";
import { UnlockButton } from "@/components/ui/buttonUnlock";

function ArenaView() {
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
				<div className="breadcrumbs h-[52px] flex items-center px-4">
					<ul>
						<li>
							<h1 className="text-lg font-bold">Play</h1>
						</li>
						<li>
							<h2 className="text-md text-muted-foreground font-bold">Arena</h2>
						</li>
					</ul>
				</div>
			</div>

			<Separator />

			<ScrollArea
				className={cn("relative h-full w-full px-4", !currentRun && "animate-gray-fluff")}
			>
				<ScrollBar />

				{isPending && <Loader2 className="animate-spin mx-auto w-80 my-20" />}

				<div className="absolute top-4 right-4 flex gap-2">
					<ArenaActionButtons />
				</div>

				{!currentRun && !isPending && (
					<div className="w-full mt-32 flex items-center justify-center fadeInTop ease-out">
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
						{/* {hasCurrentRun && <div>Current run: {data[0].id}</div>} */}
						<div className="flex gap-4">
							<div>Round: {currentRun.round}</div>
							<div className="text-green-300">Wins: {currentRun.wins}</div>
							<div className="text-red-300">Losses: {currentRun.losses}</div>
							<div className="text-yellow-300">Gold: {currentRun.gold}</div>
							<div className="text-sky-300">XP: {currentRun.xp}</div>
						</div>
						{shop && <ArenaDraggableView shop={shop} />}
					</div>
				)}
			</ScrollArea>
		</>
	);
}

export { ArenaView };
