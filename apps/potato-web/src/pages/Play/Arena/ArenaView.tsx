import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { trpc } from "@/services/api/trpc";
import { Loader2 } from "lucide-react";

function ArenaView() {
	const utils = trpc.useUtils();

	const { data, error, isFetching } = trpc.arena.my.useQuery();
	const { mutateAsync: newRun, isPending: newRunIsPending } = trpc.arena.new.useMutation({
		onSuccess: () => {
			utils.arena.my.invalidate();
		},
	});

	const { mutateAsync: abandonRun, isPending: abandonRunIsPending } =
		trpc.arena.abandon.useMutation({
			onSuccess: () => {
				utils.arena.my.invalidate();
			},
		});

	console.log(data);
	console.log(error?.message);

	if (isFetching) {
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

	console.log(data);

	const hasCurrentRun = data && data.length > 0;

	return (
		<ScrollArea className="h-full w-full px-4">
			<ScrollBar />
			<div className="relative">
				{hasCurrentRun && <div>Current run: {data[0].id}</div>}
				{!hasCurrentRun && (
					<Button disabled={newRunIsPending} onClick={onClickNewRun}>
						New run
					</Button>
				)}
				{hasCurrentRun && (
					<Button disabled={abandonRunIsPending} onClick={onClickAbandonRun} variant="destructive">
						Abandon run
					</Button>
				)}
			</div>
		</ScrollArea>
	);
}

export { ArenaView };
