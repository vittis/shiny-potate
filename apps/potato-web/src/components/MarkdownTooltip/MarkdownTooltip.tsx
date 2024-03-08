import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface MarkdownTooltipProps {
	children: React.ReactNode;
	sourcePath: string;
	onOpenChange?: (open: boolean) => void;
	weapon?: any;
}

// todo rename EquipmentTooltip
const MarkdownTooltip = ({ children, sourcePath, onOpenChange, weapon }: MarkdownTooltipProps) => {
	const [open, setOpen] = useState(false);

	function finalOnOpenChange(open: boolean) {
		if (!onOpenChange) {
			setOpen(open);
			return;
		}

		onOpenChange(open);
		setOpen(open);
	}

	return (
		<TooltipProvider delayDuration={400}>
			<Tooltip open={open} onOpenChange={finalOnOpenChange}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className="p-0">
					<MarkdownContent sourcePath={sourcePath} parentTooltipSetOpen={setOpen} weapon={weapon} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export { MarkdownTooltip };
