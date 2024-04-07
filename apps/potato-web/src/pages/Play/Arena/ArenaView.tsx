import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/services/api/trpc";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/services/api/queryClient";
import { ArenaDraggableView } from "./ArenaDraggableView/ArenaDraggableView";
import { TooltipSettigs } from "@/components/MarkdownTooltip/TooltipSettings";

function ArenaView() {
	const { client } = trpc.useUtils(); // todo fuck trpc-react, use vanilla client

	const { data, error, isFetching, isPending } = useQuery({
		queryKey: ["arena", "my"],
		queryFn: () => client.arena.my.query(),
	});

	const { mutateAsync: newRun, isPending: newRunIsPending } = trpc.arena.new.useMutation({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["arena", "my"] });
		},
	});

	const { mutateAsync: abandonRun, isPending: abandonRunIsPending } =
		trpc.arena.abandon.useMutation({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["arena", "my"] });
			},
		});

	if (isPending) {
		return <Loader2 className="animate-spin mx-auto w-80 my-20" />;
	}

	if (error) {
		return <div>{error?.message || "Could not fetch arena run :("}</div>;
	}

	function onClickNewRun() {
		newRun();
	}

	function onClickAbandonRun() {
		abandonRun();
	}

	const hasCurrentRun = data && data.length > 0;
	const shop = data?.[0]?.shop;

	return (
		<>
			<div>
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

			<ScrollArea className="relative h-full w-full px-4">
				<ScrollBar />

				<div className="absolute top-4 right-4 flex gap-2">
					<div className="flex justify-center">
						{!hasCurrentRun && (
							<Button disabled={newRunIsPending} onClick={onClickNewRun}>
								Start New Run
							</Button>
						)}
						{hasCurrentRun && (
							<Button
								disabled={abandonRunIsPending}
								onClick={onClickAbandonRun}
								variant="destructive"
							>
								Abandon run
							</Button>
						)}
					</div>
					<TooltipSettigs />
				</div>

				<div className="mt-4">
					{/* {hasCurrentRun && <div>Current run: {data[0].id}</div>} */}
					{hasCurrentRun && (
						<div className="flex gap-4">
							<div>Round: {data[0].round}</div>
							<div className="text-green-300">Wins: {data[0].wins}</div>
							<div className="text-red-300">Losses: {data[0].losses}</div>
							<div className="text-yellow-300">Gold: {data[0].gold}</div>
							<div className="text-sky-300">XP: {data[0].xp}</div>
						</div>
					)}
					{shop && <ArenaDraggableView shop={shop} />}
				</div>
			</ScrollArea>
		</>
	);
}

export { ArenaView };
