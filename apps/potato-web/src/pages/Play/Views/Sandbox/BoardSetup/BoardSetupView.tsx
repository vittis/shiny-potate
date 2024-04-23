import React, { useEffect } from "react";
import {
	DndContext,
	DragEndEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { tierColorMap } from "@/components/MarkdownContent/MarkdownComponents";
import { MarkdownTooltip } from "@/components/MarkdownTooltip/MarkdownTooltip";
import { EquipmentMarkdownContent } from "@/components/MarkdownContent/EquipmentMarkdownContent";
import { useSandboxQueries } from "@/services/features/Sandbox/useSandboxQueries";
import { MarkdownContent } from "@/components/MarkdownContent/MarkdownContent";
import { Separator } from "@/components/ui/separator";
import { getUnitData, oldGetUnitData } from "game-logic";
import { useBoardUnitsStore } from "@/services/features/Sandbox/useBoardUnitsStore";
import { DraggableBoardUnit } from "./DraggableBoardUnit";
import { trpc } from "@/services/api/trpc";
import { DroppableTile } from "./DroppableTile";
import { UnitInstanceContent } from "../../Arena/ArenaDraggableView/Shop/DraggableUnit/UnitInstanceContent";

export interface UnitsDTO {
	equipments: any[]; // ShopEquipmentData
	position: number;
	unitClass: string;
}

/* 
    2 1 0   0 1 2
    5 4 3   3 4 5
*/
export function BoardSetupView() {
	const navigate = useNavigate();

	const { shopData: data, isFetchingRollShop: isFetching } = useSandboxQueries();

	const { mutateAsync: setupTeamsMutation, isPending } = trpc.sandbox.setupTeams.useMutation({
		onSuccess: data => {
			localStorage.setItem("game", JSON.stringify(data));
			toast.success("Game started!");
			navigate("/game");
		},
	});

	const classes = data?.classes || [];
	const weapons = [...(data?.weapons || []), ...(data?.trinkets || [])] || [];

	const { boardLeft, boardRight, setBoardLeft, setBoardRight, resetBoards } = useBoardUnitsStore();

	useEffect(() => {
		const board = JSON.parse(localStorage.getItem("boardLeft") || "[]");
		const boardRight = JSON.parse(localStorage.getItem("boardRight") || "[]");

		if (board.length > 0) {
			setBoardLeft(board);
			setBoardRight(boardRight);
		}
	}, []);

	function onClickReset() {
		resetBoards();
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
		activationConstraint: {
			distance: 1,
		},
	});

	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			distance: 1,
		},
	});

	const sensors = useSensors(mouseSensor, touchSensor);

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

	if (isFetching) {
		return <Loader2 className="mx-auto mt-20 w-80 animate-spin" />;
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
				<div className="flex flex-col gap-6 p-6">
					<div className="flex grow flex-col">
						<div className="mt-4 flex min-h-[100px] w-full flex-wrap items-center justify-center gap-4">
							{classes.map(unitClass => (
								<MarkdownTooltip
									key={unitClass.id}
									content={<MarkdownContent sourcePath={`Classes/${unitClass.name}`} />}
								>
									<DraggableBoardUnit id={unitClass.id} isClass>
										{unitClass.name}
									</DraggableBoardUnit>
								</MarkdownTooltip>
							))}
						</div>

						<Separator className="mb-4 mt-8" />

						<div className="mt-4 flex min-h-[100px] w-full flex-wrap items-center justify-center gap-4">
							{weapons?.map(weapon => (
								<MarkdownTooltip
									key={weapon.id}
									content={<EquipmentMarkdownContent equip={weapon} />}
								>
									<div className="font-mono">
										<DraggableBoardUnit id={weapon.id} weaponTier={weapon.tier}>
											{weapon.name}{" "}
											<span className={cn("text-xs", tierColorMap[weapon.tier])}>
												T{weapon.tier}
											</span>
										</DraggableBoardUnit>
									</div>
								</MarkdownTooltip>
							))}
						</div>
					</div>

					<Separator className="mt-2" />

					<div className="mt-10 flex min-w-[500px] items-center justify-center gap-20">
						<div className="grid h-fit w-fit grid-cols-3 gap-5">
							{boardLeft.map(({ id, unit }) => (
								<React.Fragment key={id}>
									{unit ? (
										<DroppableTile id={id}>
											<MarkdownTooltip
												content={
													<UnitInstanceContent
														unitId={unit.id}
														// @ts-ignore
														unitInfo={undefined}
														unit={oldGetUnitData(unit, 0, id) as any}
													/>
												}
											>
												<DraggableBoardUnit
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
												</DraggableBoardUnit>
											</MarkdownTooltip>
										</DroppableTile>
									) : (
										<DroppableTile id={id}></DroppableTile>
									)}
								</React.Fragment>
							))}
						</div>
						<div className="grid h-fit w-fit grid-cols-3 gap-5">
							{boardRight.map(({ id, unit }) => (
								<React.Fragment key={id}>
									{unit ? (
										<DroppableTile id={id}>
											<MarkdownTooltip
												content={
													<UnitInstanceContent
														unitId={unit.id}
														// @ts-ignore
														unitInfo={undefined}
														unit={oldGetUnitData(unit, 0, id) as any}
													/>
												}
											>
												<DraggableBoardUnit
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
												</DraggableBoardUnit>
											</MarkdownTooltip>
										</DroppableTile>
									) : (
										<DroppableTile id={id}></DroppableTile>
									)}
								</React.Fragment>
							))}
						</div>
					</div>
				</div>
			</DndContext>
			<div className="mx-auto mt-2 flex w-fit flex-col gap-4 pb-20">
				<Button onClick={onClickStartGame} disabled={isPending}>
					Start game {isPending && <Loader2 className="ml-1 w-[15px] animate-spin" />}
				</Button>
				<Button variant="ghost" onClick={onClickReset}>
					Reset
				</Button>
			</div>
		</>
	);
}
