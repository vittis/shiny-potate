import { create } from "zustand";
import { Unit } from "game-logic";

// not being used yet

interface BoardUnitsState {
	units: any[]; // todo serialized unit type?
	addUnit: (owner: number, position: number) => void;
}

const useBoardUnitsStore = create<BoardUnitsState>()(set => ({
	units: [],
	addUnit: (owner: number, position: number) => {
		const unit = new Unit(owner, position).serialize();

		return set(state => ({ units: [...state.units, unit] }));
	},
}));

export { useBoardUnitsStore };
