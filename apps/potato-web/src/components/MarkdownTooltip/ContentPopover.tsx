import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { TOOLTIP_CONTENT_CLASSNAME } from "./ContentChainableTooltip";
import { MarkdownTooltipProps } from "./MarkdownTooltip";
import { PopoverPortal } from "@radix-ui/react-popover";
import { useState } from "react";

const ContentPopover = ({
	children,
	content,
	onOpenCallback,
	forceClose,
}: MarkdownTooltipProps) => {
	const [open, setOpen] = useState(false);

	function onOpenHandler(open) {
		setOpen(open);
		if (onOpenCallback) {
			onOpenCallback(open);
		}
	}

	const finalOpen = forceClose ? false : open;

	return (
		<Popover open={finalOpen} onOpenChange={onOpenHandler}>
			<PopoverTrigger
				className="group"
				// asChild // todo this breaks sandbox view
				onClick={e => {
					e.stopPropagation();
				}}
			>
				{children}
			</PopoverTrigger>
			<PopoverPortal>
				<PopoverContent className={cn(TOOLTIP_CONTENT_CLASSNAME)}>{content}</PopoverContent>
			</PopoverPortal>
		</Popover>
	);
};

export { ContentPopover };
