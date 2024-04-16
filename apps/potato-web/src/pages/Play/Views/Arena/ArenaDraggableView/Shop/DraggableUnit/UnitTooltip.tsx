import { EquipmentMarkdownContent } from "@/components/MarkdownContent/EquipmentMarkdownContent";
import { MarkdownContent } from "@/components/MarkdownContent/MarkdownContent";
import {
	EquipmentInstance,
	EquippedShopEquip,
	ShopEquipInstance,
	UnitInfo,
	getUnitData,
} from "game-logic";
import { UnitInstanceContent } from "./UnitInstanceContent";
import { setBoard, setStorage } from "@/services/features/Arena/useArenaUpdate";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";

export interface UnitTooltipProps {
	unit: UnitInfo;
	onOpenSubTooltip?: () => void;
	allowRemoveEquip?: boolean;
}

function UnitTooltip({ unit, onOpenSubTooltip, allowRemoveEquip = true }: UnitTooltipProps) {
	const { board, storage } = useArenaQueries();
	const { className, shopEquipment } = unit;

	const onRemoveEquip = (id: string) => {
		if (!board || !storage) return;

		let shopEquip: ShopEquipInstance | undefined = undefined;

		const newBoard = board.map(space => {
			const boardUnit = space.unit;

			if (boardUnit) {
				const targetEquip = boardUnit.unit.shopEquipment.find(e => e.shopEquip.equip.id === id);
				if (targetEquip) {
					shopEquip = targetEquip.shopEquip;
				}
				return {
					...space,
					unit: {
						...boardUnit,
						unit: {
							...boardUnit.unit,
							shopEquipment: [
								...boardUnit.unit.shopEquipment.filter(e => e.shopEquip.equip.id !== id),
							],
						},
					},
				};
			}
			return space;
		});
		setBoard(newBoard);

		if (!shopEquip) {
			return;
		}

		setStorage({
			units: storage.units,
			equips: [...storage.equips, shopEquip],
		});
	};

	return (
		<div className="relative">
			<UnitInstanceContent
				// unitInfo={unit}
				unit={
					getUnitData(
						{ id: "a", name: className, equipment: shopEquipment.map(e => e.shopEquip.equip) },
						0,
						"0",
					) // todo: refactor getUnitData to equip with slot
				}
			/>
			<div className="absolute -right-[15px] top-0 h-full w-[15px] bg-transparent" />
			<div className="absolute -left-[15px] top-0 h-full w-[15px] bg-transparent" />

			<div className="absolute left-0 top-0 z-50 w-max translate-x-[-102%] rounded-md border border-green-900 bg-popover text-popover-foreground shadow-md outline-none">
				<div className="relative">
					<MarkdownContent
						sourcePath={`Classes/${className}`}
						onOpenSubTooltip={onOpenSubTooltip}
					/>
				</div>
			</div>

			<div className="absolute right-0 top-0 z-50 w-max translate-x-[102%] rounded-md border border-yellow-700 bg-popover text-popover-foreground shadow-md outline-none">
				<div className="relative">
					{shopEquipment.length > 0 && (
						<EquipmentMarkdownContent
							equip={shopEquipment[0].shopEquip.equip} // todo allow slot (EquippedItemInstance)
							onOpenSubTooltip={onOpenSubTooltip}
							onRemoveEquip={allowRemoveEquip ? onRemoveEquip : undefined}
						/>
					)}

					<div className="absolute -bottom-[15px] left-0 h-[15px] w-full bg-transparent"></div>
					{shopEquipment.length > 1 && (
						<RecursiveEquipmentMarkdownContent
							equip={shopEquipment[1].shopEquip.equip}
							otherEquips={shopEquipment.slice(2)}
							onOpenSubTooltip={onOpenSubTooltip}
							onRemoveEquip={allowRemoveEquip ? onRemoveEquip : undefined}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export { UnitTooltip };

const RecursiveEquipmentMarkdownContent = ({
	equip,
	onOpenSubTooltip,
	otherEquips,
	onRemoveEquip,
}: {
	equip: EquipmentInstance;
	onOpenSubTooltip?: () => void;
	otherEquips: EquippedShopEquip[];
	onRemoveEquip?: (id: string) => void;
}) => {
	return (
		<div className="absolute bottom-0 left-0 z-50 w-max translate-y-[105%] rounded-md border border-yellow-700 bg-popover text-popover-foreground shadow-md outline-none">
			<div className="relative">
				<EquipmentMarkdownContent
					onRemoveEquip={onRemoveEquip}
					equip={equip}
					onOpenSubTooltip={onOpenSubTooltip}
				/>
				{otherEquips.length > 0 && (
					<>
						<div className="absolute -bottom-[15px] left-0 h-[15px] w-full bg-transparent"></div>
						<RecursiveEquipmentMarkdownContent
							otherEquips={otherEquips.slice(1)}
							equip={otherEquips[0].shopEquip.equip}
							onOpenSubTooltip={onOpenSubTooltip}
							onRemoveEquip={onRemoveEquip}
						/>
					</>
				)}
			</div>
		</div>
	);
};
