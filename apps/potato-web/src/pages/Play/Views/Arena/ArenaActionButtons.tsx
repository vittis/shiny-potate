import { Button } from "@/components/ui/button";
import { UnlockButton } from "@/components/ui/buttonUnlock";
import { useArenaMutations } from "@/services/features/Arena/useArenaMutations";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// todo componentize properly
export const CrazyButton = ({ children, onClick }) => {
	return (
		<button
			onClick={onClick}
			className="group relative inline-block w-[202px] cursor-pointer text-lg"
		>
			<span className="relative z-10 block overflow-hidden rounded-lg border-2 border-input bg-black py-3 font-medium leading-tight text-gray-100 transition-colors duration-75 ease-out group-hover:border-transparent group-hover:text-black">
				<span className="absolute inset-0 h-full w-full rounded-lg bg-background px-5 py-3"></span>
				<span className="ease absolute left-0 h-40 w-full origin-top-right -translate-x-full translate-y-16 -rotate-90 bg-white transition-all duration-300 group-hover:-rotate-180"></span>
				<span className="relative transition-colors">{children}</span>
			</span>
			{/* <span
				className="absolute bottom-0 right-0 -mb-0.5 h-12 w-full rounded-lg bg-input transition-all duration-200 ease-linear group-hover:mb-0 group-hover:mr-0 group-hover:bg-white"
				data-rounded="rounded-lg"
			></span> */}
		</button>
	);
};

function ArenaActionButtons() {
	const { currentRun, storage, board } = useArenaQueries();

	const { abandonRun, abandonRunIsPending, findAndBattleOpponent, findAndBattleOpponentIsPending } =
		useArenaMutations();

	const navigate = useNavigate();

	const onClickUpdateBoard = async () => {
		if (!board || !storage) {
			throw new Error("Board or storage is missing");
		}

		const { gameId } = await findAndBattleOpponent();
		navigate(`/game?id=${gameId}`);
	};

	const isReadyDisabled = !currentRun || !board || !storage || !board.some(b => b.unit);

	return (
		<div className="flex items-center justify-center gap-4">
			{currentRun && (
				<>
					<UnlockButton
						onClick={onClickUpdateBoard}
						icon={<ArrowRight />}
						isLoading={findAndBattleOpponentIsPending}
						disabled={isReadyDisabled}
						className="w-[200px]"
					>
						Find Opponent
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
