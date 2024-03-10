import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useTooltipStore } from "./useTooltipStore";

interface MarkdownTooltipProps {
	children: React.ReactNode;
	sourcePath: string;
	onOpenSubTooltip?: () => void;
}

const InnerMarkdownTooltip = ({ children, sourcePath, onOpenSubTooltip }: MarkdownTooltipProps) => {
	const [open, setOpen] = useState(false);

	function finalOnOpenChange(open: boolean) {
		if (!onOpenSubTooltip) {
			setOpen(open);
			return;
		}

		onOpenSubTooltip();
		setOpen(open);
	}

	return (
		<TooltipProvider delayDuration={400}>
			<Tooltip open={open} onOpenChange={finalOnOpenChange}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className="p-0 w-max max-w-[550px]">
					<MarkdownContent sourcePath={sourcePath} onOpenSubTooltip={() => setOpen(true)} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const MarkdownPopover = ({ children, sourcePath }: MarkdownTooltipProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="p-0 w-max max-w-[550px]">
				<MarkdownContent sourcePath={sourcePath} />
			</PopoverContent>
		</Popover>
	);
};

const MarkdownTooltip = (props: MarkdownTooltipProps) => {
	const tooltipMode = useTooltipStore(state => state.tooltipMode);

	if (tooltipMode === "click") {
		return <MarkdownPopover {...props} />;
	}

	return <InnerMarkdownTooltip {...props} />;
};

export { MarkdownTooltip };
