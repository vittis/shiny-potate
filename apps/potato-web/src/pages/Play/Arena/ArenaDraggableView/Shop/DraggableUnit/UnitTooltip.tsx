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
			<div className="absolute top-0 -right-[15px] h-full bg-transparent w-[15px]" />
			<div className="absolute top-0 -left-[15px] h-full bg-transparent w-[15px]" />

			<div className="translate-x-[-102%] w-max absolute top-0 left-0 z-50 rounded-md border border-green-900 bg-popover text-popover-foreground shadow-md outline-none">
				<div className="relative">
					<MarkdownContent
						sourcePath={`Classes/${className}`}
						onOpenSubTooltip={onOpenSubTooltip}
					/>
				</div>
			</div>

			<div className="translate-x-[102%] w-max absolute top-0 right-0 z-50 rounded-md border border-yellow-700 bg-popover text-popover-foreground shadow-md outline-none">
				<div className="relative">
					<EquipmentMarkdownContent
						equip={shopEquipment[0].shopEquip.equip} // todo allow slot (EquippedItemInstance)
						onOpenSubTooltip={onOpenSubTooltip}
					/>
					<div className="absolute -bottom-[15px] left-0 w-full bg-transparent h-[15px]"></div>

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
		<div className="translate-y-[105%] w-max absolute bottom-0 left-0 z-50 rounded-md border border-yellow-700 bg-popover text-popover-foreground shadow-md outline-none">
			<div className="relative">
				<EquipmentMarkdownContent equip={equip} onOpenSubTooltip={onOpenSubTooltip} />
				{otherEquips.length > 0 && (
					<>
						<div className="absolute -bottom-[15px] left-0 w-full bg-transparent h-[15px]"></div>
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
