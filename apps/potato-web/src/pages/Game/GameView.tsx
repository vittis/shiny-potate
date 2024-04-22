import App from "@/App";
import { PHASER_CONFIG } from "@/game/config";
import { Battle } from "@/game/scenes/battle/BattleScene";
import { useGameState } from "@/services/state/useGameState";
import { useEffect } from "react";
import { GameSpeedControls } from "./GameSpeedControls";
import { CopyEventHistoryWidget } from "./CopyEventHistoryWidget";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { PlayersInfo } from "./PlayersInfo";
import { Button } from "@/components/ui/button";
import { viewBattle } from "@/services/features/Arena/useArenaQueries";
import { ChevronLeft } from "lucide-react";

const GameView = () => {
	const gameInstance = useGameState(state => state.gameInstance);
	const setGameInstance = useGameState(state => state.setGameInstance);
	const hideGame = useGameState(state => state.hideGame);
	const isGameHidden = useGameState(state => state.isGameHidden);
	const showGame = useGameState(state => state.showGame);

	const [searchParams] = useSearchParams();
	const gameId = searchParams.get("id");

	const { data } = useQuery({
		queryKey: ["view", "battle", gameId],
		queryFn: () => viewBattle(gameId || ""),
		enabled: !!gameId,
	});

	useEffect(() => {
		if (!gameInstance && !isGameHidden) {
			setGameInstance(new Phaser.Game(Object.assign(PHASER_CONFIG, { scene: [Battle] })));
		} else if (gameInstance && isGameHidden) {
			if (gameInstance.scene.isActive("BattleScene")) {
				showGame();

				const scene = gameInstance.scene.getScene("BattleScene");
				// @ts-expect-error how to type this?
				scene?.fetchBattle();
				// gameInstance.scene.getScene("BattleScene").scene.restart(); // todo: fix battleunitsprite to make this work
			}
		}

		return () => {
			hideGame();
		};
	}, []);

	const navigate = useNavigate();
	const location = useLocation();

	return (
		<>
			<App />

			<GameSpeedControls />

			<CopyEventHistoryWidget gameData={data} />

			<PlayersInfo />

			<div className="absolute left-4 top-20">
				<Button
					disabled={location.key === "default"}
					onClick={() => navigate(-1)}
					variant="outline"
					size="icon"
				>
					<ChevronLeft size={30} />
				</Button>
			</div>
		</>
	);
};

export { GameView };
