import { Shop } from "game-logic";
import { ShopEquipment } from "./ShopEquipment";
import { DraggableEntity } from "./DraggableEntity";
import { ShopUnit } from "./ShopUnit";

interface ShopViewInterface {
	shop: Shop;
}

function ShopView({ shop }: ShopViewInterface) {
	const { weapons, trinkets, units } = shop;

	const sampley = [units[0]];

	return (
		<>
			<div className="mt-10 flex justify-center gap-4">
				{units?.map(unit => <ShopUnit key={unit.id} shopUnit={unit} />)}
			</div>

			<div className="mt-6 flex justify-center">
				<div className="flex gap-10">
					<div className="flex gap-4">
						{weapons?.map(weapon => <DraggableEntity key={weapon.id} shopEquipment={weapon} />)}
					</div>
					<div className="flex gap-4">
						{trinkets?.map(trinket => <DraggableEntity key={trinket.id} shopEquipment={trinket} />)}
					</div>
				</div>
			</div>
		</>
	);
}

export { ShopView };
