import { EquipmentMarkdownContent } from "@/components/MarkdownContent/EquipmentMarkdownContent";
import { MarkdownContent } from "@/components/MarkdownContent/MarkdownContent";
import { EquipmentInstance, ShopEquipInstance, UnitInfo, getUnitData } from "game-logic";
import { UnitInstanceContent } from "./UnitInstanceContent";

export interface UnitTooltipProps {
	unit: UnitInfo;
	onOpenSubTooltip?: () => void;
}

function UnitTooltip({ unit, onOpenSubTooltip }: UnitTooltipProps) {
	const { className, shopEquipment } = unit;
	return (
		<div className="relative">
			<UnitInstanceContent
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
					<EquipmentMarkdownContent
						equip={shopEquipment[0].shopEquip.equip} // todo allow slot (EquippedItemInstance)
						onOpenSubTooltip={onOpenSubTooltip}
					/>
					<div className="absolute -bottom-[15px] left-0 h-[15px] w-full bg-transparent"></div>

					{shopEquipment.length > 1 && (
						<RecursiveEquipmentMarkdownContent
							equip={shopEquipment[1].shopEquip.equip}
							otherEquips={shopEquipment.slice(2)}
							onOpenSubTooltip={onOpenSubTooltip}
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
}: {
	equip: EquipmentInstance;
	onOpenSubTooltip?: () => void;
	otherEquips: any[]; // todo dont have this type
}) => {
	return (
		<div className="absolute bottom-0 left-0 z-50 w-max translate-y-[105%] rounded-md border border-yellow-700 bg-popover text-popover-foreground shadow-md outline-none">
			<div className="relative">
				<EquipmentMarkdownContent equip={equip} onOpenSubTooltip={onOpenSubTooltip} />
				{otherEquips.length > 0 && (
					<>
						<div className="absolute -bottom-[15px] left-0 h-[15px] w-full bg-transparent"></div>
						<RecursiveEquipmentMarkdownContent
							otherEquips={otherEquips.slice(1)}
							equip={otherEquips[0].equip}
							onOpenSubTooltip={onOpenSubTooltip}
						/>
					</>
				)}
			</div>
		</div>
	);
};
