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
		if (!!overPosition) {
			const unit = event.active.data.current?.unit;

			if (unit) {
				const newBoard = board.map(space => {
					if (space.position === overPosition) {
						return {
							...space,
							unit: { ...unit, position: space.position },
						};
					}

					return space;
				});

				setBoard(newBoard);
			}
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
