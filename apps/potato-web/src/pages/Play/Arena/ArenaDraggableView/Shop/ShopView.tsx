import { Shop } from "game-logic";
import { DraggableShopEquipment } from "./DraggableShopEquipment/DraggableShopEquipment";
import { DraggableShopUnit } from "./DraggableUnit/DraggableShopUnit";
import { useArenaStore } from "@/services/features/Arena/useArenaStore";

interface ShopViewInterface {
	shop: Shop;
}

function ShopView({ shop }: ShopViewInterface) {
	const { board, storage } = useArenaStore(state => ({
		board: state.board,
		storage: state.storage,
	}));
	const { weapons, trinkets, units } = shop;

	return (
		<>
			<div className="mt-10 flex justify-center gap-4">
				{units
					?.filter(unit => {
						const isUnitOnBoard = board.some(space => space.unit?.id === unit.id);
						const isUnitOnStorage = storage.units.some(storageUnit => storageUnit.id === unit.id);
						return !isUnitOnBoard && !isUnitOnStorage;
					})
					?.map(unit => <DraggableShopUnit key={unit.id} shopUnit={unit} />)}
			</div>

			<div className="mt-6 flex justify-center">
				<div className="flex gap-10">
					<div className="flex gap-4 flex-wrap justify-center">
						{weapons?.map(weapon => (
							<DraggableShopEquipment key={weapon.id} shopEquipment={weapon} />
						))}
					</div>
					<div className="flex gap-4 flex-wrap justify-center">
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
