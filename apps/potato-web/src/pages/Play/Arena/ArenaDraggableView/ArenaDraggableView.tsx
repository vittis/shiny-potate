import { BoardUnitInstance, Shop, ShopEquipmentInstance, ShopUnitInstance } from "game-logic";
import { ShopView } from "./Shop/ShopView";
import {
	DndContext,
	DragEndEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { DroppableBoardSpace } from "./Board/DroppableBoardSpace";
import { useArenaStore } from "@/services/features/Arena/useArenaStore";
import { DroppableStorage } from "./Storage/DroppableStorage";
import { DraggableBoardUnit } from "./Shop/DraggableUnit/DraggableBoardUnit";
import { ArrowLeftIcon, ArrowRightIcon, SwordsIcon } from "lucide-react";

interface ArenaDraggableViewProps {
	shop?: Shop;
}

function ArenaDraggableView({ shop }: ArenaDraggableViewProps) {
	const { board, setBoard, storage, setStorage } = useArenaStore();

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
		const overPosition = event.over?.data.current?.position;
		const unit = event.active.data.current?.unit as ShopUnitInstance | BoardUnitInstance | null;

		const shopEquip = event.active.data.current?.shopEquipment as ShopEquipmentInstance | null;

		if (event.over?.id === "storage") {
			const storageUnits = storage.units;
			const storageEquips = storage.equips;

			if (unit) {
				const isAlreadyInStorage = !!storageUnits.find(storageUnit => storageUnit.id === unit.id);
				if (!isAlreadyInStorage) {
					setStorage({
						units: [...storageUnits, unit],
						equips: storageEquips,
					});
				}
			}
		}

		if (!!overPosition) {
			// dropped a shop equipment into a unit in board space
			if (shopEquip) {
				const newBoard = board.map(space => {
					if (space.position === overPosition) {
						const boardUnit = space.unit;
						if (boardUnit) {
							return {
								...space,
								unit: {
									...boardUnit,
									unit: {
										...boardUnit.unit,
										equipment: [
											...(boardUnit?.unit?.equipment || []),
											// todo dont hardcode TRINKET. do a equip() logic
											{ slot: "TRINKET" as any, equip: shopEquip.equipment },
										],
									},
								},
							};
						}
					}

					return space;
				});
				setBoard(newBoard);
				return;
			}

			// dropped a unit into a board space
			if (unit) {
				const unitOver = event.over?.data?.current?.unit;
				const isAlreadyOnBoard = !!board.find(space => space.unit?.id === unit.id);
				const storageUnit = storage.units.find(storageUnit => storageUnit.id === unit.id);

				// from shop to already occupied board space: do nothing
				if (unitOver && !isAlreadyOnBoard && !storageUnit) {
					return;
				}

				if (storageUnit) {
					const storageUnits = storage.units.filter(storageU => storageU.id !== unit.id);
					// from storage to empty board space: remove from storage
					if (!unitOver) {
						setStorage({
							units: storageUnits,
							equips: storage.equips,
						});
					}

					// from storage to occupied board space: add unitOver to storage
					if (unitOver && storageUnit) {
						setStorage({
							units: [...storage.units.filter(storageU => storageU.id !== unit.id), unitOver],
							equips: storage.equips,
						});
					}
				}

				const newBoard = board.map(space => {
					// add unit to new position
					if (space.position === overPosition) {
						return {
							...space,
							unit: { ...unit, position: space.position },
						};
					}
					// remove unit from previous position if dropped outside of board
					if (!unitOver && isAlreadyOnBoard && space.unit?.id === unit.id) {
						return {
							...space,
							unit: null,
						};
					}
					// swap units if dropped on another unit from BOARD
					if (unitOver && isAlreadyOnBoard && space.position === (unit as any)?.position) {
						return {
							...space,
							unit: { ...unitOver, position: space.position },
						};
					}

					return space;
				});
				setBoard(newBoard);
				return;
			}
		}
		// dragged outside of board
		const isFromBoard = unit && !!board.find(space => space.unit?.id === unit?.id);
		if (isFromBoard) {
			const newBoard = board.map(space => {
				if (space.unit?.id === unit?.id) {
					return {
						...space,
						unit: null,
					};
				}

				return space;
			});

			setBoard(newBoard);

			// add to storage
			setStorage({
				units: [...storage.units, unit],
				equips: storage.equips,
			});
		}
	}

	console.log(board);

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
			{shop && <ShopView shop={shop} />}

			<div className="mt-16 mb-40 flex justify-center items-center gap-16">
				<div className="relative w-fit h-fit grid grid-cols-3 gap-5">
					{board.map(space => (
						<DroppableBoardSpace key={space.position} boardSpace={space}>
							{space.unit && <DraggableBoardUnit boardUnit={space.unit} />}
						</DroppableBoardSpace>
					))}

					<div className="font-sm text-zinc-200 pt-2.5 flex items-center gap-2 absolute font-mono bottom-0 right-1/2 translate-x-1/2 translate-y-full w-max">
						<ArrowRightIcon size={17} />
					</div>
				</div>

				<DroppableStorage storage={{ units: storage.units, equips: storage.equips }} />
			</div>
		</DndContext>
	);
}

export { ArenaDraggableView };
