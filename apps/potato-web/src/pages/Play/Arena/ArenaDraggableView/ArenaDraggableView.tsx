import { Shop } from "game-logic";
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
import { DraggableUnit } from "./Shop/DraggableUnit/DraggableUnit";
import { useArenaStore } from "@/services/features/Arena/useArenaStore";

interface ArenaDraggableViewProps {
	shop?: Shop;
}

function ArenaDraggableView({ shop }: ArenaDraggableViewProps) {
	const { board, setBoard } = useArenaStore();

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
		const unit = event.active.data.current?.unit;

		if (!!overPosition) {
			if (unit) {
				const isAlreadyOnBoard = !!board.find(space => space.unit?.id === unit.id);
				const unitOver = event.over?.data?.current?.unit;
				console.log(event.over?.data.current);

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
					// swap units if dropped on another unit
					if (unitOver && isAlreadyOnBoard && space.position === unit.position) {
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
		const isFromBoard = !!board.find(space => space.unit?.id === unit?.id);
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
		}
	}

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
			{shop && <ShopView shop={shop} />}

			<div className="mt-10 flex justify-center">
				<div className="w-fit h-fit grid grid-cols-3 gap-5">
					{board.map(space => (
						<DroppableBoardSpace key={space.position} boardSpace={space}>
							{space.unit && <DraggableUnit id={space.unit.id} unit={space.unit} />}
						</DroppableBoardSpace>
					))}
				</div>
			</div>
		</DndContext>
	);
}

export { ArenaDraggableView };
