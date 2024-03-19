import { create } from "zustand";

interface GameControlsState {
	stepTime: number;
	animationSpeed: number;
	setStepTime: (stepTime: number) => void;
	setAnimationSpeed: (animationSpeed: number) => void;
}

const initialStepTime = localStorage.getItem("stepTime")
	? parseInt(localStorage.getItem("stepTime")!)
	: 100;
const initialAnimationSpeed = localStorage.getItem("animationSpeed")
	? parseFloat(localStorage.getItem("animationSpeed")!)
	: 0.6;

const useGameControlsStore = create<GameControlsState>()(set => ({
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

export { useGameControlsStore };
