import { equipToMarkdown } from "./MarkdownContentUtils";
import { MarkdownWrapper } from "./MarkdownWrapper";

interface MarkdownContentProps {
	onOpenSubTooltip?: () => void;
	equip: any;
}

const EquipmentMarkdownContent = ({ onOpenSubTooltip, equip }: MarkdownContentProps) => {
	return (
		<MarkdownWrapper
			content={equipToMarkdown(equip)}
			tier={equip?.data?.tier}
			tags={equip?.data?.tags}
			onOpenSubTooltip={onOpenSubTooltip}
		/>
	);
};

export { EquipmentMarkdownContent };
