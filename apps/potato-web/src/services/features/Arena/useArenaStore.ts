import { BoardUnitInstance, ShopEquipmentInstance, ShopUnitInstance } from "game-logic";
import { create } from "zustand";

const initialBoard: { position: string; unit: BoardUnitInstance | null }[] = [
	{
		position: "2",
		unit: null,
	},
	{
		position: "1",
		unit: null,
	},
	{
		position: "0",
		unit: null,
	},
	{
		position: "5",
		unit: null,
	},
	{
		position: "4",
		unit: null,
	},
	{
		position: "3",
		unit: null,
	},
];

interface ArenaState {
	board: { position: string; unit: BoardUnitInstance | null }[];
	setBoard: (newBoard: { position: string; unit: BoardUnitInstance | null }[]) => void;
	storage: { units: ShopUnitInstance[]; equips: ShopEquipmentInstance[] };
	setStorage: (newStorage: { units: ShopUnitInstance[]; equips: ShopEquipmentInstance[] }) => void;
}

const useArenaStore = create<ArenaState>()(set => ({
	board: initialBoard,
	setBoard: (newBoard: { position: string; unit: BoardUnitInstance | null }[]) =>
		set({ board: newBoard }),
	storage: { units: [], equips: [] },
	setStorage: (newStorage: { units: ShopUnitInstance[]; equips: ShopEquipmentInstance[] }) =>
		set({ storage: newStorage }),
}));

export { useArenaStore };
