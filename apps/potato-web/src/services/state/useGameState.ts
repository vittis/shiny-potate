import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameState {
	gameInstance: Phaser.Game | null;
	isGameHidden: boolean;
	isGamePaused: boolean;
	hasGameStarted: boolean;
	selectedEntity: any;
	isGameOver: boolean;
	shouldRestartGame: boolean;
	setSelectedEntity: (entity: any) => void;
	setIsGameOver: (isGameOver: boolean) => void;
	setIsGamePaused: (isGamePaused: boolean) => void;
	setGameInstance: (gameInstance: Phaser.Game | null) => void;
	restartGame: () => void;
	hideGame: () => void;
	showGame: () => void;
}

const useGameState = create<GameState>()(
	subscribeWithSelector(set => ({
		selectedEntity: null,
		isGameHidden: false,
		isGamePaused: true,
		isGameOver: false,
		hasGameStarted: false,
		shouldRestartGame: false,
		setIsGameOver: (isGameOver: boolean) => set({ isGameOver }),
		setIsGamePaused: (isGamePaused: boolean) =>
			set({ isGamePaused, hasGameStarted: true, shouldRestartGame: false }),
		setSelectedEntity: (entity: any) => set({ selectedEntity: entity }),
		gameInstance: null,
		setGameInstance: (gameInstance: Phaser.Game | null) => set({ gameInstance }),
		restartGame: () =>
			set({
				shouldRestartGame: true,
				hasGameStarted: false,
				isGamePaused: true,
				isGameOver: false,
			}),
		hideGame: () =>
			set(({ gameInstance, isGameHidden }) => {
				if (gameInstance) {
					// state.gameInstance.destroy(true); // todo: fix battleunitsprite to make this work
					gameInstance.canvas.classList.add("hidden");
					return { isGameHidden: true };
				}

				return { isGameHidden };
			}),
		showGame: () =>
			set(({ gameInstance, isGameHidden }) => {
				if (gameInstance) {
					gameInstance.canvas.classList.remove("hidden");
					return { isGameHidden: false };
				}

				return { isGameHidden };
			}),
	})),
);

export { useGameState };
