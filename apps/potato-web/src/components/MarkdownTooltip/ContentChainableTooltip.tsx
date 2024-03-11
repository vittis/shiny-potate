import { cloneElement, useState } from "react";
import { MarkdownTooltipProps } from "./MarkdownTooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useTooltipStore } from "./useTooltipStore";
import { cn } from "@/lib/utils";
import { TooltipPortal } from "@radix-ui/react-tooltip";

export const TOOLTIP_CONTENT_CLASSNAME = "p-0 w-max max-w-[750px]";

const ContentChainableTooltip = ({
	children,
	onOpenSubTooltip,
	content,
	onOpenCallback,
}: MarkdownTooltipProps) => {
	const [open, setOpen] = useState(false);
	const hoverDelay = useTooltipStore(state => state.hoverDelay);

	function finalOnOpenChange(open: boolean) {
		if (!onOpenSubTooltip) {
			setOpen(open);
			if (onOpenCallback) {
				onOpenCallback(open);
			}
			return;
		}

		onOpenSubTooltip();
		setOpen(open);
		if (onOpenCallback) {
			onOpenCallback(open);
		}
	}

	const contentProps = { onOpenSubTooltip: () => setOpen(true) };
	const contentElement = cloneElement(content, contentProps);

	return (
		<TooltipProvider delayDuration={hoverDelay}>
			<Tooltip open={open} onOpenChange={finalOnOpenChange}>
				<TooltipTrigger>{children}</TooltipTrigger>
				{!onOpenSubTooltip ? (
					<TooltipPortal>
						<TooltipContent className={cn(TOOLTIP_CONTENT_CLASSNAME)}>
							{contentElement}
						</TooltipContent>
					</TooltipPortal>
				) : (
					<TooltipContent className={cn(TOOLTIP_CONTENT_CLASSNAME)}>
						{contentElement}
					</TooltipContent>
				)}
			</Tooltip>
		</TooltipProvider>
	);
};

export { ContentChainableTooltip };
