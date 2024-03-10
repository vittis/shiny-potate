import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { TOOLTIP_CONTENT_CLASSNAME } from "./ContentChainableTooltip";
import { MarkdownTooltipProps } from "./MarkdownTooltip";

const ContentPopover = ({ children, content }: MarkdownTooltipProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className={cn(TOOLTIP_CONTENT_CLASSNAME)}>{content}</PopoverContent>
		</Popover>
	);
};

export { ContentPopover };
