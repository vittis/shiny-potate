import React, { useEffect, useState } from "react";
import {
	DndContext,
	DragEndEvent,
	MouseSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2, X } from "lucide-react";
import { api } from "@/services/api/http";
import { tierColorMap } from "@/components/MarkdownContent/MarkdownComponents";
import { MarkdownTooltip } from "@/components/MarkdownTooltip/MarkdownTooltip";
import { EquipmentMarkdownContent } from "@/components/MarkdownContent/EquipmentMarkdownContent";
import { useSandboxQueries } from "@/services/features/Sandbox/useSandboxQueries";
import { MarkdownContent } from "@/components/MarkdownContent/MarkdownContent";

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

export function Draggable({ children, id, unit, isClass, weaponTier, removeEquipment }: any) {
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);

	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id,
		data: { unit }, // todo use this
	});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const unitEquips = unit?.equipment || [];
	const isWeapon = !isClass && !unit;

	const finalListeners = isTooltipOpen ? {} : listeners;
	const finalAttributes = isTooltipOpen ? {} : attributes;

	return (
		<button
			ref={setNodeRef}
			style={style}
			{...finalListeners}
			{...finalAttributes}
			className={cn(
				"w-[100px] h-[100px] rounded-md border border-zinc-700 relative bg-black transition-colors",
				isDragging && "z-30",
				isClass && "border-green-900 hover:border-green-700",
				!isClass &&
					!unit &&
					"border-dashed border-yellow-700 hover:border-yellow-600 w-auto h-auto p-1",
				isWeapon && tierColorMap[weaponTier],
			)}
		>
			{children}
			{unitEquips.length > 0 && (
				<div className="absolute top-0 right-0">
					{unitEquips.map(equip => (
						<MarkdownTooltip
							onOpenCallback={setIsTooltipOpen}
							key={equip.id}
							content={
								<div className="bg-pattern-gradient relative">
									<EquipmentMarkdownContent equip={equip} />
									<Button
										className="absolute top-1 right-1 text-red-400 flex items-center gap-1"
										variant="ghost"
										size="sm"
										onClick={() => {
											setIsTooltipOpen(false);
											removeEquipment(equip.id);
										}}
									>
										Unequip
									</Button>
								</div>
							}
						>
							<div
								className={cn(
									"border border-yellow-700 border-dashed rounded p-0.5 text-xs",
									tierColorMap[equip.data.tier],
								)}
							>
								{equip.data.name}{" "}
								<span className={cn("text-xs", tierColorMap[equip.data.tier])}>
									T{equip.data.tier}
								</span>
							</div>
						</MarkdownTooltip>
					))}
				</div>
			)}
		</button>
	);
}

export function Droppable({ children, id }: any) {
	const { isOver, setNodeRef } = useDroppable({
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
export function BoardSetupView() {
	const navigate = useNavigate();

	const { shopData: data, isFetchingRollShop: isFetching } = useSandboxQueries();

	const { mutateAsync: setupTeamsMutation, isPending } = useMutation({
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

			const weapon = weapons.find(weapon => weapon.id === event.active.id);

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

	const mouseSensor = useSensor(MouseSensor, {
		// Require the mouse to move by 10 pixels before activating
		activationConstraint: {
			distance: 1,
		},
	});

	const sensors = useSensors(mouseSensor);

	if (isFetching) {
		return <Loader2 className="animate-spin mx-auto w-80 mt-20" />;
	}
	return (
		<>
			<DndContext
				sensors={sensors}
				onDragEnd={handleDragEnd}
				/* onDragStart={() => console.log("drag start")}
				onDragCancel={() => console.log("drag cancel")}
				onDragMove={() => console.log("drag move")} */
			>
				<div className="flex p-6 gap-6 flex-col">
					<div className="grow flex flex-col">
						<div className="w-full flex gap-4 mt-4 min-h-[100px] items-center justify-center flex-wrap">
							{classes.map(unitClass => (
								<MarkdownTooltip
									content={<MarkdownContent sourcePath={`Classes/${unitClass.name}`} />}
								>
									<Draggable key={unitClass.id} id={unitClass.id} isClass>
										{unitClass.name}
									</Draggable>
								</MarkdownTooltip>
							))}
						</div>

						<div className="w-full flex gap-4 mt-4 min-h-[100px] items-center justify-center flex-wrap">
							{weapons?.map(weapon => (
								<MarkdownTooltip
									key={weapon.id}
									content={<EquipmentMarkdownContent equip={weapon} />}
								>
									<div className="font-mono">
										<Draggable id={weapon.id} weaponTier={weapon.data.tier}>
											{weapon.data.name}{" "}
											<span className={cn("text-xs", tierColorMap[weapon.data.tier])}>
												T{weapon.data.tier}
											</span>
										</Draggable>
									</div>
								</MarkdownTooltip>
							))}
						</div>
					</div>

					<div className="flex items-center justify-center min-w-[500px] gap-20 mt-10">
						<div className="w-fit h-fit grid grid-cols-3 gap-5">
							{boardLeft.map(({ id, unit }) => (
								<React.Fragment key={id}>
									{unit ? (
										<Droppable id={id}>
											<MarkdownTooltip
												content={<MarkdownContent sourcePath={`Classes/${unit.name}`} />}
											>
												<Draggable
													id={unit.id}
													unit={unit}
													isClass
													removeEquipment={(id: string) => {
														const newBoard = boardLeft.map(cell => {
															if (unit.id === cell?.unit?.id) {
																const newUnit = cell.unit;
																newUnit.equipment = newUnit.equipment.filter(
																	equip => equip.id !== id,
																);

																return {
																	...cell,
																	unit: newUnit,
																};
															}
															return cell;
														});

														setBoardLeft(newBoard);
													}}
												>
													{unit.name}
												</Draggable>
											</MarkdownTooltip>
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
											<MarkdownTooltip
												content={<MarkdownContent sourcePath={`Classes/${unit.name}`} />}
											>
												<Draggable
													id={unit.id}
													unit={unit}
													isClass
													removeEquipment={(id: string) => {
														const newBoard = boardRight.map(cell => {
															if (unit.id === cell?.unit?.id) {
																const newUnit = cell.unit;
																newUnit.equipment = newUnit.equipment.filter(
																	equip => equip.id !== id,
																);

																return {
																	...cell,
																	unit: newUnit,
																};
															}
															return cell;
														});

														setBoardRight(newBoard);
													}}
												>
													{unit.name}
												</Draggable>
											</MarkdownTooltip>
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
			<div className="mt-2 mx-auto w-fit flex flex-col gap-4">
				<Button onClick={onClickStartGame} disabled={isPending}>
					Start game {isPending && <Loader2 className="animate-spin ml-1 w-[15px]" />}
				</Button>
				<Button variant="ghost" onClick={onClickReset}>
					Reset
				</Button>
			</div>
		</>
	);
}
