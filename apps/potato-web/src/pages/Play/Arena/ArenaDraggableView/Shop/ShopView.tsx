import { Shop } from "game-logic";
import { DraggableShopEquipment } from "./DraggableShopEquipment/DraggableShopEquipment";
import { DraggableShopUnit } from "./DraggableUnit/DraggableShopUnit";
import { useArenaStore } from "@/services/features/Arena/useArenaStore";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";

interface ShopViewInterface {
	shop: Shop;
}

function ShopView({ shop }: ShopViewInterface) {
	const { storage, board } = useArenaQueries();
	const { weapons, trinkets, units } = shop;

	if (!storage || !board) {
		return null;
	}
	const allUnits = [...storage?.units, ...board.map(space => space.unit).filter(u => u)];

	const filteredUnits = units.filter(unit => {
		const isUnitOnBoard = board.some(space => space.unit?.id === unit.id);
		const isUnitOnStorage = storage?.units.some(storageUnit => storageUnit.id === unit.id);
		return !isUnitOnBoard && !isUnitOnStorage;
	});

	const filteredWeapons = weapons.filter(weapon => {
		const isWeaponOnStorage = storage?.equips.some(storageEquip => storageEquip.id === weapon.id);
		const isWeaponEquipped = allUnits.some(
			unit => unit?.unit.shopEquipment.some(equip => equip.shopEquip.id === weapon.id),
		);
		return !isWeaponOnStorage && !isWeaponEquipped;
	});

	const filteredTrinkets = trinkets.filter(trinket => {
		const isTrinketOnStorage = storage?.equips.some(storageEquip => storageEquip.id === trinket.id);
		const isTrinketEquipped = allUnits.some(
			unit => unit?.unit.shopEquipment.some(equip => equip.shopEquip.id === trinket.id),
		);
		return !isTrinketOnStorage && !isTrinketEquipped;
	});

	return (
		<>
			<div className="mt-10 flex justify-center gap-4">
				{filteredUnits?.map(unit => <DraggableShopUnit key={unit.id} shopUnit={unit} />)}
			</div>

			<div className="mt-6 flex justify-center">
				<div className="flex gap-10">
					<div className="flex gap-4 flex-wrap justify-center">
						{filteredWeapons?.map(weapon => (
							<DraggableShopEquipment key={weapon.id} shopEquip={weapon} />
						))}
					</div>
					<div className="flex gap-4 flex-wrap justify-center">
						{filteredTrinkets?.map(trinket => (
							<DraggableShopEquipment key={trinket.id} shopEquip={trinket} />
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export { ShopView };
