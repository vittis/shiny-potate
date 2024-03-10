import { cloneElement, useState } from "react";
import { MarkdownTooltipProps } from "./MarkdownTooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useTooltipStore } from "./useTooltipStore";

const ContentChainableTooltip = ({ children, onOpenSubTooltip, content }: MarkdownTooltipProps) => {
	const [open, setOpen] = useState(false);
	const hoverDelay = useTooltipStore(state => state.hoverDelay);

	function finalOnOpenChange(open: boolean) {
		if (!onOpenSubTooltip) {
			setOpen(open);
			return;
		}

		onOpenSubTooltip();
		setOpen(open);
	}

	const contentProps = { onOpenSubTooltip: () => setOpen(true) };
	const contentElement = cloneElement(content, contentProps);

	return (
		<TooltipProvider delayDuration={hoverDelay}>
			<Tooltip open={open} onOpenChange={finalOnOpenChange}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className="p-0 w-max max-w-[550px]">{contentElement}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export { ContentChainableTooltip };
