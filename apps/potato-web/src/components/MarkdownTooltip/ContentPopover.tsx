import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { TOOLTIP_CONTENT_CLASSNAME } from "./ContentChainableTooltip";
import { MarkdownTooltipProps } from "./MarkdownTooltip";
import { PopoverPortal } from "@radix-ui/react-popover";
import { useState } from "react";

const ContentPopover = ({ children, content, onOpenCallback }: MarkdownTooltipProps) => {
	const [open, setOpen] = useState(false);

	function onOpenHandler(open) {
		setOpen(open);
		if (onOpenCallback) {
			onOpenCallback(open);
		}
	}

	return (
		<Popover open={open} onOpenChange={onOpenHandler}>
			<PopoverTrigger
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
