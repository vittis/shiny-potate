import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useArenaMutations } from "@/services/features/Arena/useArenaMutations";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { useInterval } from "@/utils/useInterval";
import { ArrowRight, Loader2Icon, SwordsIcon } from "lucide-react";
import { useState } from "react";

const CrazyButton = () => {
	return (
		<button className="w-[262px] cursor-pointer relative inline-block text-lg group">
			<span className="relative z-10 block px-5 py-5 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
				<span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
				<span className="absolute left-0 w-full h-48 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-16 bg-gray-900 group-hover:-rotate-180 ease"></span>
				<span className="relative">Hammer</span>
			</span>
			<span
				className="absolute bottom-0 right-0 w-full h-12 -mb-1.5 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
				data-rounded="rounded-lg"
			></span>
		</button>
	);
};

export const UnlockButton = ({ children }) => {
	return (
		<button className="relative w-[150px] h-[50px] inline-flex items-center justify-center px-6 overflow-hidden font-medium text-black transition duration-300 ease-out border-2 border-b-4 border-input rounded shadow-md group">
			<span className="absolute inset-0 duration-300  w-full h-full text-white -translate-x-[101%]  group-hover:translate-x-0 ease">
				<div className="animate-black-swoosh w-full h-full flex items-center justify-center">
					<ArrowRight size={28} />
					{/* <Loader2Icon size={22} className="animate-spin" /> */}
				</div>
			</span>
			<span className="absolute bg-background flex items-center justify-center text-lg w-full h-full text-foreground transition-all duration-300 transform group-hover:translate-x-full ease">
				{children}
			</span>
			<span className="relative invisible"></span>
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
					<UnlockButton>Ready</UnlockButton>
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
