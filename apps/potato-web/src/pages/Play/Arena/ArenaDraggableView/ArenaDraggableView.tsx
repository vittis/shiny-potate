import { Shop, ShopUnitInstance } from "game-logic";
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
import { useState } from "react";
import { DraggableUnit } from "./Shop/DraggableUnit/DraggableUnit";

interface ArenaDraggableViewProps {
	shop?: Shop;
}

function ArenaDraggableView({ shop }: ArenaDraggableViewProps) {
	const [board, setBoard] = useState<{ position: string; unit: ShopUnitInstance | null }[]>([
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
	]);
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
							unit,
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
							{space.unit && <DraggableUnit unit={space.unit} />}
						</DroppableBoardSpace>
					))}
				</div>
			</div>
		</DndContext>
	);
}

export { ArenaDraggableView };
