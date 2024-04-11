import App from "@/App";
import { PHASER_CONFIG } from "@/game/config";
import { Battle } from "@/game/scenes/battle/BattleScene";
import { useGameState } from "@/services/state/useGameState";
import { useEffect } from "react";
import { GameSpeedControls } from "./GameSpeedControls";
import { CopyEventHistoryWidget } from "./CopyEventHistoryWidget";
import { useQuery } from "@tanstack/react-query";
import { trpc, vanillaTrpc } from "@/services/api/trpc";
import { useSearchParams } from "react-router-dom";

export function viewBattle(gameId: string) {
	return vanillaTrpc.arena.viewBattle.query({ gameId });
}

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

	console.log(data);

	useEffect(() => {
		if (!gameInstance && !isGameHidden) {
			setGameInstance(new Phaser.Game(Object.assign(PHASER_CONFIG, { scene: [Battle] })));
		} else if (gameInstance && isGameHidden) {
			if (gameInstance.scene.isActive("BattleScene")) {
				console.log("show game");
				showGame();

				console.log("SHOW?");
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

	return (
		<>
			<App />

			<GameSpeedControls />

			<CopyEventHistoryWidget />
		</>
	);
};

export { GameView };
