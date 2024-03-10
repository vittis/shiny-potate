import { useEffect, useState } from "react";
import { modToMarkdown } from "./MarkdownContentUtils";
import { MarkdownWrapper } from "./MarkdownWrapper";

interface MarkdownContentProps {
	onOpenSubTooltip?: () => void;
	equip?: any;
}

const EquipmentMarkdownContent = ({ onOpenSubTooltip, equip }: MarkdownContentProps) => {
	const [content, setContent] = useState<string | undefined>();

	useEffect(() => {
		function parseEquipToMarkdown() {
			let contentFromEquip = `# ${equip.data.name}\n`;

			let implicits = equip?.data?.mods?.filter(mod => mod.tier === "implicit");
			contentFromEquip += implicits?.map(mod => modToMarkdown(mod)).join("\n");
			if (equip?.data?.tier > 0) {
				let rolledMods = equip?.data?.mods?.filter(mod => mod.tier !== "implicit");
				contentFromEquip += "\n---\n";
				contentFromEquip += rolledMods?.map(mod => modToMarkdown(mod)).join("\n");
			}

			setContent(contentFromEquip);
		}
		parseEquipToMarkdown();
	}, []);

	return (
		<MarkdownWrapper
			content={content}
			tier={equip?.data?.tier}
			tags={equip?.data?.tags}
			onOpenSubTooltip={onOpenSubTooltip}
		/>
	);
};

export { EquipmentMarkdownContent };
