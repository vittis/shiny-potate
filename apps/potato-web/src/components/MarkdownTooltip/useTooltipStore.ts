import { create } from "zustand";

interface TooltipState {
	tooltipMode: "hover" | "click";
	hoverDelay: number;
	setTooltipMode: (tooltipMode: "hover" | "click") => void;
	setHoverDelay: (hoverDelay: number) => void;
}

const useTooltipStore = create<TooltipState>()(set => ({
	tooltipMode: (localStorage.getItem("tooltipMode") as "hover" | "click") ?? "click",
	hoverDelay: localStorage.getItem("hoverDelay")
		? parseInt(localStorage.getItem("hoverDelay")!)
		: 400,
	setTooltipMode: tooltipMode => {
		set({ tooltipMode });
		localStorage.setItem("tooltipMode", tooltipMode);
	},
	setHoverDelay: hoverDelay => {
		set({ hoverDelay });
		localStorage.setItem("hoverDelay", hoverDelay.toString());
	},
}));

export { useTooltipStore };
