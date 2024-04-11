import { EquipmentInstance } from "game-logic";
import { equipToMarkdown } from "./MarkdownContentUtils";
import { MarkdownWrapper } from "./MarkdownWrapper";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface MarkdownContentProps {
	onOpenSubTooltip?: () => void;
	equip: EquipmentInstance;
	onRemoveEquip?: (id: string) => void;
}

const EquipmentMarkdownContent = ({
	onOpenSubTooltip,
	equip,
	onRemoveEquip,
}: MarkdownContentProps) => {
	return (
		<>
			{onRemoveEquip && (
				<div className="absolute right-2 top-1">
					<Button onClick={() => onRemoveEquip(equip?.id)} variant="ghost" size="icon">
						<X width={20} className="text-primary" />
					</Button>
				</div>
			)}

			<MarkdownWrapper
				content={equipToMarkdown(equip)}
				tier={equip?.tier}
				tags={equip?.tags}
				onOpenSubTooltip={onOpenSubTooltip}
			/>
		</>
	);
};

export { EquipmentMarkdownContent };
