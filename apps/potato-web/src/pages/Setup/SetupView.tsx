import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { api } from "@/services/api/http";
import { fetchRollShop } from "./ShopView";
import { EquipmentTooltip } from "@/components/MarkdownTooltip/EquipmentMarkdownTooltip";
import { tierColorMap } from "@/components/MarkdownContent/MarkdownComponents";

const initialBoard = [
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

export async function setupTeams(data) {
	const response = await api.post("/game/setup-teams", data, {
		withCredentials: true,
	});

	return response.data;
}

export interface UnitsDTO {
	equipments: any[]; // ShopEquipmentData
	position: number;
	unitClass: string;
}

export function Draggable({ children, id, unit, isClass }: any) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id,
	});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const unitEquips = unit?.equipment || [];

	return (
		<button
			/* data-unit-id={unitId} */
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={cn(
				"w-[100px] h-[100px] rounded-md border border-zinc-700 relative bg-black transition-colors",
				isDragging && "z-30",
				isClass && "border-green-900 hover:border-green-700",
				!isClass &&
					!unit &&
					"border-dashed border-yellow-700 hover:border-yellow-600 w-auto h-auto p-1",
			)}
		>
			{children}
			{unitEquips.length > 0 && (
				<div className="absolute top-0 right-0">
					{unitEquips.map((equip, index) => (
						<div
							key={index}
							className="border border-yellow-700 border-dashed rounded p-0.5 text-xs"
						>
							{equip.name}
						</div>
					))}
				</div>
			)}
		</button>
	);
}

export function Droppable({ children, id }: any) {
	const { isOver, setNodeRef, active } = useDroppable({
		id: id,
	});

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"w-[100px] h-[100px] rounded-md border border-zinc-700 transition-transform",
				isOver && "bg-zinc-800",
				isOver && "scale-110",
			)}
		>
			{children}
		</div>
	);
}

/* 
    2 1 0   0 1 2
    5 4 3   3 4 5
*/
export function SetupView({ tier }) {
	const navigate = useNavigate();
	const { data, isFetching } = useQuery({
		queryKey: ["roll-shop", tier],
		queryFn: () => fetchRollShop({ tier }),
		staleTime: Infinity,
	});

	const { mutateAsync: setupTeamsMutation } = useMutation({
		mutationFn: setupTeams,
		mutationKey: ["setup-teams"],
		onSuccess: data => {
			localStorage.setItem("game", JSON.stringify(data));
			toast.success("Game started!");
			navigate("/game");
		},
	});

	const classes = data?.classes || [];
	const weapons = data?.weapons || [];

	const [boardLeft, setBoardLeft] = useState<{ id: string; unit: any }[]>(initialBoard);

	const [boardRight, setBoardRight] = useState<{ id: string; unit: any }[]>(initialBoardRight);

	useEffect(() => {
		const board = JSON.parse(localStorage.getItem("boardLeft") || "[]");
		const boardRight = JSON.parse(localStorage.getItem("boardRight") || "[]");

		if (board.length > 0) {
			setBoardLeft(board);
			setBoardRight(boardRight);
		}
	}, []);

	function handleDragEnd(event: DragEndEvent) {
		let targetBoard;
		let targetSetBoard;

		const fromBoardRight = !!boardRight.find(c => c.unit?.id === event.active.id);
		const fromBoardLeft = !!boardLeft.find(c => c.unit?.id === event.active.id);

		if (fromBoardRight) {
			targetBoard = boardRight;
			targetSetBoard = setBoardRight;
		} else if (fromBoardLeft) {
			targetBoard = boardLeft;
			targetSetBoard = setBoardLeft;
		} else {
			if (event.over?.id.toString().startsWith("-")) {
				targetBoard = boardRight;
				targetSetBoard = setBoardRight;
			} else {
				targetBoard = boardLeft;
				targetSetBoard = setBoardLeft;
			}
		}

		const isFromBoard = !classes.find(unitClass => unitClass.id === event.active.id);

		const isEquipment = !!weapons.find(weapon => weapon.id === event.active.id);

		if (isEquipment) {
			const targetCell = targetBoard.find(cell => cell.id === event.over?.id);
			const hasUnit = targetCell?.unit;

			if (!hasUnit) return;

			const weapon = weapons.find(weapon => weapon.id === event.active.id).data;

			const newBoard = targetBoard.map(cell => {
				if (cell.id === event.over?.id) {
					const unitEquipment = cell?.unit?.equipment || [];
					return {
						...cell,
						unit: {
							...cell.unit,
							equipment: [...unitEquipment, weapon],
						},
					};
				}
				return cell;
			});

			targetSetBoard(newBoard);

			return;
		}

		const name = classes.find(unitClass => unitClass.id === event.active.id)?.name;

		let newBoard;
		if (!isFromBoard) {
			newBoard = targetBoard.map(cell => {
				if (cell.id === event.over?.id) {
					return {
						...cell,
						unit: { id: Math.floor(Math.random() * 100), name: name },
					};
				}

				return cell;
			});
		} else {
			newBoard = targetBoard.map(cell => {
				if (cell?.unit?.id === event?.active?.id && cell.id !== event.over?.id) {
					return {
						...cell,
						unit: null,
					};
				}

				const unit = targetBoard.find(cell => cell?.unit?.id === event.active.id)?.unit;

				if (cell.id === event.over?.id) {
					return {
						...cell,
						unit: {
							id: Math.floor(Math.random() * 100),
							name: unit?.name,
							equipment: unit?.equipment,
						},
					};
				}

				return cell;
			});
		}

		targetSetBoard(newBoard);
	}

	function onClickReset() {
		setBoardLeft(initialBoard);
		setBoardRight(initialBoardRight);
	}

	function onClickStartGame() {
		const team1finalUnits: UnitsDTO[] = boardLeft
			.filter(cell => !!cell.unit)
			.map(cell => {
				return {
					equipments: cell.unit?.equipment,
					position: parseInt(cell.id),
					unitClass: cell.unit.name,
				};
			});

		const team2finalUnits: UnitsDTO[] = boardRight
			.filter(cell => !!cell.unit)
			.map(cell => {
				return {
					equipments: cell.unit?.equipment,
					position: parseInt(cell.id.toString().replace("-", "")),
					unitClass: cell.unit.name,
				};
			});

		localStorage.setItem("boardLeft", JSON.stringify(boardLeft));
		localStorage.setItem("boardRight", JSON.stringify(boardRight));

		setupTeamsMutation({ team1: team1finalUnits, team2: team2finalUnits });
	}

	if (isFetching) {
		return <Loader2 className="animate-spin mx-auto w-80 mt-20" />;
	}

	return (
		<>
			<DndContext
				// sensors={sensors}
				onDragEnd={handleDragEnd}
			>
				<div className="flex p-6 gap-6 flex-col">
					<div className="grow flex flex-col">
						<div className="w-full flex gap-4 mt-4 min-h-[100px] items-center justify-center flex-wrap">
							{classes.map(unitClass => (
								<Draggable key={unitClass.id} id={unitClass.id} isClass>
									{unitClass.name}
								</Draggable>
							))}
						</div>

						<div className="w-full flex gap-4 mt-4 min-h-[100px] items-center justify-center flex-wrap">
							{weapons.map(weapon => (
								<EquipmentTooltip key={weapon.id} equip={weapon}>
									<div className="font-mono">
										<Draggable id={weapon.id}>
											{weapon.data.name}{" "}
											<span className={cn("text-xs", tierColorMap[weapon.data.tier])}>
												T{weapon.data.tier}
											</span>
										</Draggable>
									</div>
								</EquipmentTooltip>
							))}
						</div>
					</div>

					<div className="flex items-center justify-center min-w-[500px] gap-20 mt-20">
						<div className="w-fit h-fit grid grid-cols-3 gap-5">
							{boardLeft.map(({ id, unit }) => (
								<React.Fragment key={id}>
									{unit ? (
										<Droppable id={id}>
											<Draggable id={unit.id} unit={unit} isClass>
												{unit.name}
											</Draggable>
										</Droppable>
									) : (
										<Droppable id={id}></Droppable>
									)}
								</React.Fragment>
							))}
						</div>
						<div className="w-fit h-fit grid grid-cols-3 gap-5">
							{boardRight.map(({ id, unit }) => (
								<React.Fragment key={id}>
									{unit ? (
										<Droppable id={id}>
											<Draggable id={unit.id} unit={unit} isClass>
												{unit.name}
											</Draggable>
										</Droppable>
									) : (
										<Droppable id={id}></Droppable>
									)}
								</React.Fragment>
							))}
						</div>
					</div>
				</div>
			</DndContext>

			<div className="mt-10 mx-auto w-fit flex flex-col gap-4">
				<Button onClick={onClickStartGame}>Start game</Button>
				<Button variant="ghost" onClick={onClickReset}>
					Reset
				</Button>
			</div>
		</>
	);
}
