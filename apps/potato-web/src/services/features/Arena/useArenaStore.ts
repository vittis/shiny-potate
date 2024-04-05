/* import { ShopUnitInstance } from "game-logic";
import { create } from "zustand";

interface ArenaState {
	board: { position: string; unit: ShopUnitInstance }[];
}

const useArenaStore = create<ArenaState>()(set => ({
	stepTime: initialStepTime,
	animationSpeed: initialAnimationSpeed,
	setStepTime: (stepTime: number) => {
		set({ stepTime });
		localStorage.setItem("stepTime", stepTime.toString());
	},
	setAnimationSpeed: (animationSpeed: number) => {
		set({ animationSpeed });
		localStorage.setItem("animationSpeed", animationSpeed.toString());
	},
}));

export { useArenaStore };
 */
