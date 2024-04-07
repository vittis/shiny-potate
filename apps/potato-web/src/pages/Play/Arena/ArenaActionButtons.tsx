import { Button } from "@/components/ui/button";
import { UnlockButton } from "@/components/ui/buttonUnlock";
import { cn } from "@/lib/utils";
import { useArenaMutations } from "@/services/features/Arena/useArenaMutations";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { useInterval } from "@/utils/useInterval";
import { ArrowRight, Loader2Icon, SwordsIcon } from "lucide-react";
import { useState } from "react";

const CrazyButton = () => {
	return (
		<button className="w-[262px] cursor-pointer relative inline-block text-lg group">
			<span className="relative bg-black z-10 block px-5 py-5 overflow-hidden font-medium leading-tight text-gray-200 transition-colors duration-300 ease-out border-2 border-input rounded-lg group-hover:text-gray-200">
				<span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-background"></span>
				<span className="absolute left-0 w-full h-48 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-16 bg-input group-hover:-rotate-180 ease"></span>
				<span className="relative">Hammer</span>
			</span>
			<span
				className="absolute bottom-0 right-0 w-full h-12 -mb-0.5 transition-all duration-200 ease-linear bg-input rounded-lg group-hover:mb-0 group-hover:mr-0"
				data-rounded="rounded-lg"
			></span>
		</button>
	);
};

function ArenaActionButtons() {
	const { currentRun } = useArenaQueries();

	const { newRun, newRunIsPending, abandonRun, abandonRunIsPending } = useArenaMutations();

	const [isBouncing, setIsBouncing] = useState(false);

	useInterval(() => {
		setIsBouncing(!isBouncing);
	}, 3000);

	return (
		<div className="flex justify-center items-center gap-4">
			{/* {!currentRun && (
				<Button disabled={newRunIsPending} onClick={() => newRun()}>
					Start New Run
				</Button>
			)} */}
			{currentRun && (
				<>
					<UnlockButton onClick={() => abandonRun()} icon={<ArrowRight />}>
						Ready
					</UnlockButton>
					{/* <Button variant="outline">Ready</Button> */}
					{/* <Button
						disabled={abandonRunIsPending}
						onClick={() => abandonRun()}
						className={cn("transition-all", isBouncing && "animate-bounce")}
					>
						Ready
					</Button> */}
					<Button
						disabled={abandonRunIsPending}
						onClick={() => abandonRun()}
						variant="ghost"
						className="text-red-300 h-full"
					>
						Give Up
					</Button>
				</>
			)}
		</div>
	);
}

export { ArenaActionButtons };
