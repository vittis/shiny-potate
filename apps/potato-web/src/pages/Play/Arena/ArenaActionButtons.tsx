import { Button } from "@/components/ui/button";
import { UnlockButton } from "@/components/ui/buttonUnlock";
import { useArenaMutations } from "@/services/features/Arena/useArenaMutations";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { ArrowRight } from "lucide-react";

export const CrazyButton = () => {
	return (
		<button className="group relative inline-block w-[262px] cursor-pointer text-lg">
			<span className="relative z-10 block overflow-hidden rounded-lg border-2 border-input bg-black px-5 py-5 font-medium leading-tight text-gray-200 transition-colors duration-300 ease-out group-hover:text-gray-200">
				<span className="absolute inset-0 h-full w-full rounded-lg bg-background px-5 py-3"></span>
				<span className="ease absolute left-0 h-48 w-full origin-top-right -translate-x-full translate-y-16 -rotate-90 bg-input transition-all duration-300 group-hover:-rotate-180"></span>
				<span className="relative">Hammer</span>
			</span>
			<span
				className="absolute bottom-0 right-0 -mb-0.5 h-12 w-full rounded-lg bg-input transition-all duration-200 ease-linear group-hover:mb-0 group-hover:mr-0"
				data-rounded="rounded-lg"
			></span>
		</button>
	);
};

function ArenaActionButtons() {
	const { currentRun, storage, board } = useArenaQueries();

	const { abandonRun, abandonRunIsPending, findAndBattleOpponent, findAndBattleOpponentIsPending } =
		useArenaMutations();

	const onClickUpdateBoard = async () => {
		if (!board || !storage) {
			throw new Error("Board or storage is missing");
		}

		await findAndBattleOpponent();
	};

	return (
		<div className="flex items-center justify-center gap-4">
			{currentRun && (
				<>
					<UnlockButton
						onClick={onClickUpdateBoard}
						icon={<ArrowRight />}
						isLoading={findAndBattleOpponentIsPending}
					>
						Ready
					</UnlockButton>
					<Button
						disabled={abandonRunIsPending}
						onClick={() => abandonRun()}
						variant="ghost"
						className="h-full text-red-300"
					>
						Give Up
					</Button>
				</>
			)}
		</div>
	);
}

export { ArenaActionButtons };
