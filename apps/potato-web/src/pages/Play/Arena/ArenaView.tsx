import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/services/api/trpc";
import { ArrowRight, ArrowRightIcon, Loader2, Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/services/api/queryClient";
import { ArenaDraggableView } from "./ArenaDraggableView/ArenaDraggableView";
import { TooltipSettigs } from "@/components/MarkdownTooltip/TooltipSettings";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { ArenaActionButtons, UnlockButton } from "./ArenaActionButtons";
import { useArenaMutations } from "@/services/features/Arena/useArenaMutations";
import { cn } from "@/lib/utils";

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

				<div className="absolute top-4 right-4 flex gap-2">
					<ArenaActionButtons />
				</div>

				{!currentRun && (
					<div className="w-full mt-32 flex items-center justify-center fadeInTop">
						<Button
							disabled={isLoading}
							onClick={() => newRun()}
							variant="ghost"
							className="relative w-[320px] h-[75px] inline-flex items-center justify-center px-6 overflow-hidden font-medium text-black transition duration-300 ease-out border-2 border-b-4 border-input rounded shadow-md group"
						>
							<span
								className={cn(
									"absolute inset-0 duration-300 w-full h-full text-white -translate-x-[101%] group-hover:translate-x-0 ease",
									isLoading && "!-translate-x-[101%] hidden",
								)}
							>
								<div
									className={cn(
										"w-full h-full flex items-center justify-center",
										!isLoading && "animate-black-swoosh",
									)}
								>
									<ArrowRightIcon size={32} />
								</div>
							</span>
							<span
								className={cn(
									"font-mono absolute flex items-center justify-center text-2xl w-full h-full text-foreground",
									!isLoading &&
										"bg-background transition-all duration-300 transform group-hover:translate-x-full ease",
									isLoading && "",
								)}
							>
								{isLoading ? <Loader2Icon size={32} className="animate-spin" /> : "Enter The Arena"}
							</span>
							<span className="relative invisible"></span>
						</Button>
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
