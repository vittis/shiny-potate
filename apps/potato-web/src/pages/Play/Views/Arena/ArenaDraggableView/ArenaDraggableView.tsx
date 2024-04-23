import { BoardUnitInstance, Shop, ShopEquipInstance, ShopUnitInstance } from "game-logic";
import { ShopView } from "./Shop/ShopView";
import {
	DndContext,
	DragEndEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { DroppableStorage } from "./Storage/DroppableStorage";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { setBoard, setStorage } from "@/services/features/Arena/useArenaUpdate";
import { BoardContainer } from "./Board/BoardContainer";
import { toast } from "react-toastify";

interface ArenaDraggableViewProps {
	shop?: Shop;
}

function ArenaDraggableView({ shop }: ArenaDraggableViewProps) {
	const { storage, board } = useArenaQueries();

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

	let checkSubset = (parentArray, subsetArray) => {
		return subsetArray.every(el => {
			return parentArray.includes(el);
		});
	};

	function getDesiredSlot(equip: ShopEquipInstance, currentEquips: ShopEquipInstance[]) {
		const possibleSlots = equip.equip.slots;
		if (currentEquips.length > 0) {
			const notAvailableSlot: string[] = currentEquips.map(equipment => equipment.slot);
			if (
				possibleSlots.includes("TWO_HANDS") &&
				notAvailableSlot.includes("MAIN_HAND" || "OFF_HAND" || "TWO_HANDS")
			) {
				toast.error(`Can't equip ${equip.equip.name}, not available slots.`);
				return;
			}
			if (
				possibleSlots.includes("MAIN_HAND" || "OFF_HAND") &&
				notAvailableSlot.includes("TWO_HANDS")
			) {
				toast.error(`Can't equip ${equip.equip.name}, not available slots.`);
				return;
			}
			if (
				possibleSlots.includes("TRINKET") &&
				notAvailableSlot.includes("TRINKET" && "TRINKET_2")
			) {
				toast.error(`Can't equip ${equip.equip.name}, not available slots.`);
				return;
			}
			if (
				possibleSlots.includes("TRINKET") &&
				!notAvailableSlot.includes("TRINKET_2") &&
				notAvailableSlot.includes("TRINKET")
			) {
				return "TRINKET_2";
			}

			if (checkSubset(notAvailableSlot, possibleSlots)) {
				toast.error(`Can't equip ${equip.equip.name}, not available slots.`);
				return;
			} else {
				const availableSlot = possibleSlots.filter(element => !element.includes(notAvailableSlot));
				return availableSlot[0];
			}
		}

		return possibleSlots[0];
	}

	function handleDragEnd(event: DragEndEvent) {
		if (!board || !storage) {
			throw new Error("board or storage is not defined");
		}

		const overPosition = event.over?.data.current?.position;

		const unit = event.active.data.current?.unit as ShopUnitInstance | BoardUnitInstance | null;
		const shopEquip = event.active.data.current?.shopEquip as ShopEquipInstance | null;

		if (event.over?.id === "storage") {
			const storageUnits = storage?.units || [];
			const storageEquips = storage?.equips || [];

			if (unit) {
				const isAlreadyInStorage = !!storageUnits.find(storageUnit => storageUnit.id === unit.id);
				if (!isAlreadyInStorage) {
					setStorage({
						units: [...storageUnits, unit],
						equips: storageEquips,
					});
				}
			}
			if (shopEquip) {
				const isAlreadyInStorage = !!storageEquips.find(
					storageEquip => storageEquip.id === shopEquip.id,
				);
				if (!isAlreadyInStorage) {
					setStorage({
						units: storageUnits,
						equips: [...storageEquips, shopEquip],
					});
				}
			}
		}

		if (!!overPosition) {
			// dropped a shop equip into a unit in board space
			if (shopEquip) {
				const isFromStorage = !!storage?.equips.find(
					storageEquip => storageEquip.id === shopEquip.id,
				);
				setBoard(prevBoard =>
					prevBoard.map(space => {
						if (space.position === overPosition) {
							const boardUnit = space.unit;
							if (boardUnit) {
								const desiredSlot = getDesiredSlot(shopEquip, boardUnit.unit.shopEquipment); // todo: fix types
								if (!desiredSlot && !isFromBoard) {
									return space;
								}
								if (!desiredSlot && isFromBoard) {
									if (isFromStorage) {
										const storageEquips = storage?.equips.filter(
											storageEquip => storageEquip.id !== shopEquip.id,
										);

										setStorage({
											units: storage?.units || [],
											equips: storageEquips || [],
										});
									}
									return space;
								}
								return {
									...space,
									unit: {
										...boardUnit,
										unit: {
											...boardUnit.unit,
											shopEquipment: [
												...boardUnit.unit.shopEquipment,
												// todo dont hardcode TRINKET. do a equip() logic
												{ slot: desiredSlot as any, shopEquip },
											],
										},
									},
								};
							}
						}
						return space;
					}),
				);
				// dropped shop equip from storage to board unit
				if (isFromStorage) {
					const storageEquips = storage?.equips.filter(
						storageEquip => storageEquip.id !== shopEquip.id,
					);

					setStorage({
						units: storage?.units || [],
						equips: storageEquips || [],
					});
				}
			}

			// dropped a unit into a board space
			if (unit) {
				const unitOver = event.over?.data?.current?.unit;
				const isAlreadyOnBoard = !!board.find(space => space.unit?.id === unit.id);
				const storageUnit = storage?.units.find(storageUnit => storageUnit.id === unit.id);

				// from shop to already occupied board space: do nothing
				if (unitOver && !isAlreadyOnBoard && !storageUnit) {
					return;
				}

				if (storageUnit) {
					const storageUnits = storage?.units.filter(storageU => storageU.id !== unit.id);
					// from storage to empty board space: remove from storage
					if (!unitOver) {
						setStorage({
							units: storageUnits || [],
							equips: storage?.equips || [],
						});
					}

					// from storage to occupied board space: add unitOver to storage
					if (unitOver && storageUnit) {
						setStorage({
							units: [
								...(storage?.units.filter(storageU => storageU.id !== unit.id) || []),
								unitOver,
							],
							equips: storage?.equips || [],
						});
					}
				}

				setBoard(prevBoard =>
					prevBoard.map(space => {
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
					}),
				);
				// handleDragEnd ends here
				return;
			}
		}
		// dragged outside of board
		const isFromBoard = unit && !!board.find(space => space.unit?.id === unit?.id);
		if (isFromBoard) {
			setBoard(prevBoard =>
				prevBoard.map(space => {
					if (space.unit?.id === unit?.id) {
						return {
							...space,
							unit: null,
						};
					}

					return space;
				}),
			);

			// add to storage
			setStorage({
				units: [...(storage?.units || []), unit],
				equips: storage?.equips || [],
			});
		}
	}

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
			{shop && <ShopView shop={shop} />}

			<div className="mb-40 mt-16 flex items-center justify-center gap-16">
				<BoardContainer />

				{storage && <DroppableStorage storage={storage} />}
			</div>
		</DndContext>
	);
}

export { ArenaDraggableView };
