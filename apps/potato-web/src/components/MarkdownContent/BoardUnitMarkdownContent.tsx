import { Unit } from "game-logic";
import { MarkdownWrapper } from "./MarkdownWrapper";

interface MarkdownContentProps {
	onOpenSubTooltip?: () => void;
	unit: Unit;
}

const BoardUnitMarkdownContent = ({ onOpenSubTooltip, unit }: MarkdownContentProps) => {
	console.log(unit);
	return <MarkdownWrapper content={""} onOpenSubTooltip={onOpenSubTooltip} />;
};

export { BoardUnitMarkdownContent };
