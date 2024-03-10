import { create } from "zustand";

interface TooltipState {
	tooltipMode: "hover" | "click";
	setTooltipMode: (tooltipMode: "hover" | "click") => void;
}

const useTooltipStore = create<TooltipState>()(set => ({
	tooltipMode: (localStorage.getItem("tooltipMode") as "hover" | "click") ?? "hover",
	setTooltipMode: tooltipMode => {
		set({ tooltipMode });
		localStorage.setItem("tooltipMode", tooltipMode);
	},
}));

export { useTooltipStore };
