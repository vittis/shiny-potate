import { BoardUnitInstance, ShopEquipInstance, ShopUnitInstance } from "game-logic";
import { create } from "zustand";

interface ArenaState {
	/* board: { position: string; unit: BoardUnitInstance | null }[];
	setBoard: (newBoard: { position: string; unit: BoardUnitInstance | null }[]) => void; */
	/* storage: { units: ShopUnitInstance[]; equips: ShopEquipInstance[] };
	setStorage: (newStorage: { units: ShopUnitInstance[]; equips: ShopEquipInstance[] }) => void; */
}

const useArenaStore = create<ArenaState>()(set => ({
	/* board: initialBoard,
	setBoard: (newBoard: { position: string; unit: BoardUnitInstance | null }[]) =>
		set({ board: newBoard }), */
	/* storage: { units: [], equips: [] },
	setStorage: (newStorage: { units: ShopUnitInstance[]; equips: ShopEquipInstance[] }) =>
		set({ storage: newStorage }), */
}));

export { useArenaStore };
