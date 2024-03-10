import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MarkdownTooltipProps } from "./MarkdownTooltip";

const ContentPopover = ({ children, content }: MarkdownTooltipProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="p-0 w-max max-w-[550px]">{content}</PopoverContent>
		</Popover>
	);
};

export { ContentPopover };
