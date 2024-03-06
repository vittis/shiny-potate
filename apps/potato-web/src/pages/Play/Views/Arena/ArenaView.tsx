import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { Button } from "@/components/ui/button";
import { useArenaMutation } from "@/services/features/Arena/useArenaMutation";
import { SetupView } from "@/pages/Setup/SetupView";
import { format } from "date-fns";

const ArenaView = () => {
	const user = useSupabaseUserStore(state => state.user);

	const { createArenaGame, win } = useArenaMutation();
	const { arenaData, arenaIsLoading, hasGame, game } = useArenaQueries();

	const onClickCreateArena = async () => {
		await createArenaGame(user.id);
	};

	const onClickWin = async () => {
		await win(game);
	};
	return (
		<div className="flex flex-col h-full">
			{user && (
				<>
					{!hasGame && <Button onClick={onClickCreateArena}> New Run</Button>}
					{hasGame && game && (
						<div>
							<div className="flex w-full justify-between py-4 px-4">
								<div> Gold: {game.gold} </div>
								<div>
									{" "}
									Wins: {game.wins} Losses: {game.losses}{" "}
								</div>
								<div> Started At: {format(game.created_at, "MM/dd/yy")} </div>
							</div>
							<SetupView />
							<Button onClick={onClickWin}> Win Game</Button>
						</div>
					)}
				</>
			)}

			{!user && <h1 className="px-4 mt-2 text-muted-foreground">Sign in to start an arena</h1>}
		</div>
	);
};

export default ArenaView;
