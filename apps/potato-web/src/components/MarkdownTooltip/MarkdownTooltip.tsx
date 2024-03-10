import React from "react";
import { useTooltipStore } from "./useTooltipStore";
import { ContentChainableTooltip } from "./ContentChainableTooltip";
import { ContentPopover } from "./ContentPopover";

export interface MarkdownTooltipProps {
	children: React.ReactElement;
	onOpenSubTooltip?: () => void;
	content: React.ReactElement;
}

const MarkdownTooltip = (props: MarkdownTooltipProps) => {
	const tooltipMode = useTooltipStore(state => state.tooltipMode);

	if (tooltipMode === "click") {
		return <ContentPopover {...props} />;
	}

	return <ContentChainableTooltip {...props} />;
};

export { MarkdownTooltip };
