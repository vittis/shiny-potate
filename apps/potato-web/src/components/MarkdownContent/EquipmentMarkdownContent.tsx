import { EquipmentInstance } from "game-logic";
import { equipToMarkdown } from "./MarkdownContentUtils";
import { MarkdownWrapper } from "./MarkdownWrapper";

interface MarkdownContentProps {
	onOpenSubTooltip?: () => void;
	equip: EquipmentInstance;
}

const EquipmentMarkdownContent = ({ onOpenSubTooltip, equip }: MarkdownContentProps) => {
	return (
		<MarkdownWrapper
			content={equipToMarkdown(equip)}
			tier={equip?.tier}
			tags={equip?.tags}
			onOpenSubTooltip={onOpenSubTooltip}
		/>
	);
};

export { EquipmentMarkdownContent };
