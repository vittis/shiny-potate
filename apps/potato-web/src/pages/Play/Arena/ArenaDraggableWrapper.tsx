import { Shop } from "game-logic";
import { ShopView } from "./ShopView";
import {
	DndContext,
	DragEndEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { DraggableEntity } from "./DraggableEntity";
import { DroppableEntity } from "./DroppableEntity";
import { useState } from "react";

interface ArenaWrapperProps {
	shop?: Shop;
}

function ArenaWrapper({ shop }: ArenaWrapperProps) {
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
		console.log("drag end", event);
		/* if (event.over) {
			if (!event.over.data.current?.databaum) {
				event.over.data = { current: { totally: "stuff" } };
			}
		} */
	}

	const [board, setBoard] = useState([
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

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
			<div>
				{/* <DraggableEntity /> */}

				{/* <DroppableEntity /> */}

				{shop && <ShopView shop={shop} />}

				<div className="mt-10 flex justify-center">
					<div className="w-fit h-fit grid grid-cols-3 gap-5">
						{board.map(space => (
							<DroppableEntity key={space.position} boardSpace={space} />
						))}
					</div>
				</div>
			</div>
		</DndContext>
	);
}

export { ArenaWrapper };
