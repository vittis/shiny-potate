import { EquipmentMarkdownContent } from "@/components/MarkdownContent/EquipmentMarkdownContent";
import { tierColorMap } from "@/components/MarkdownContent/MarkdownComponents";
import { MarkdownTooltip } from "@/components/MarkdownTooltip/MarkdownTooltip";
import { cn } from "@/lib/utils";
import { ShopEquipmentInstance } from "game-logic";
import { DraggableShopEntity } from "./DraggableShopEntity";

interface ShopEquipmentInterface {
	shopEquipment: ShopEquipmentInstance;
}

const ShopEquipment = ({ shopEquipment }: ShopEquipmentInterface) => {
	const { equipment, price } = shopEquipment;

	return (
		<MarkdownTooltip key={equipment.id} content={<EquipmentMarkdownContent equip={equipment} />}>
			<div className="font-mono">
				<div className="text-yellow-300">{price}</div>
				<DraggableShopEntity id={equipment.id} weaponTier={equipment.tier}>
					{equipment.name}{" "}
					<span className={cn("text-xs", tierColorMap[equipment.tier])}>T{equipment.tier}</span>
				</DraggableShopEntity>
			</div>
		</MarkdownTooltip>
	);
};

export { ShopEquipment };
