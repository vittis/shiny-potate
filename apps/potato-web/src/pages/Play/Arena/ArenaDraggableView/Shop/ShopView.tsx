import { Shop } from "game-logic";
import { DraggableShopEquipment } from "./DraggableShopEquipment/DraggableShopEquipment";
import { DraggableShopUnit } from "./DraggableUnit/DraggableShopUnit";

interface ShopViewInterface {
	shop: Shop;
}

function ShopView({ shop }: ShopViewInterface) {
	const { weapons, trinkets, units } = shop;

	return (
		<>
			<div className="mt-10 flex justify-center gap-4">
				{units?.map(unit => <DraggableShopUnit key={unit.id} shopUnit={unit} />)}
			</div>

			<div className="mt-6 flex justify-center">
				<div className="flex gap-10">
					<div className="flex gap-4">
						{weapons?.map(weapon => (
							<DraggableShopEquipment key={weapon.id} shopEquipment={weapon} />
						))}
					</div>
					<div className="flex gap-4">
						{trinkets?.map(trinket => (
							<DraggableShopEquipment key={trinket.id} shopEquipment={trinket} />
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export { ShopView };
