import { create } from "zustand";
import { DragEndEvent } from "@dnd-kit/core";

const initialBoardLeft = [
	{
		id: "2",
		unit: null,
	},
	{
		id: "1",
		unit: null,
	},
	{
		id: "0",
		unit: null,
	},
	{
		id: "5",
		unit: null,
	},
	{
		id: "4",
		unit: null,
	},
	{
		id: "3",
		unit: null,
	},
];

const initialBoardRight = [
	{
		id: "-0",
		unit: null,
	},
	{
		id: "-1",
		unit: null,
	},
	{
		id: "-2",
		unit: null,
	},
	{
		id: "-3",
		unit: null,
	},
	{
		id: "-4",
		unit: null,
	},
	{
		id: "-5",
		unit: null,
	},
];

const storedBoardLeft = localStorage.getItem("boardLeft")
	? JSON.parse(localStorage.getItem("boardLeft") as string)
	: undefined;
const storedBoardRight = localStorage.getItem("boardRight")
	? JSON.parse(localStorage.getItem("boardRight") as string)
	: undefined;

interface BoardUnitsState {
	boardLeft: any[];
	boardRight: any[];
	setBoardLeft: (board: any[]) => void;
	setBoardRight: (board: any[]) => void;
	resetBoards: () => void;
}

const useBoardUnitsStore = create<BoardUnitsState>()(set => ({
	boardLeft: storedBoardLeft ?? initialBoardLeft,
	boardRight: storedBoardRight ?? initialBoardRight,
	setBoardLeft: board => {
		localStorage.setItem("boardLeft", JSON.stringify(board));
		set({ boardLeft: board });
	},
	setBoardRight: board => {
		localStorage.setItem("boardRight", JSON.stringify(board));
		set({ boardRight: board });
	},
	resetBoards: () => {
		localStorage.removeItem("boardLeft");
		localStorage.removeItem("boardRight");
		set({ boardLeft: initialBoardLeft, boardRight: initialBoardRight });
	},
}));

export { useBoardUnitsStore };
