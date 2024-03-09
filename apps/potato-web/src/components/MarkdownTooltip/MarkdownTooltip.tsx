import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";

interface MarkdownTooltipProps {
	children: React.ReactNode;
	sourcePath: string;
	onOpenChange?: (open: boolean) => void;
}

const MarkdownTooltip = ({ children, sourcePath, onOpenChange }: MarkdownTooltipProps) => {
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
				<TooltipContent className="p-0 max-w-[550px]">
					<MarkdownContent sourcePath={sourcePath} parentTooltipSetOpen={setOpen} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export { MarkdownTooltip };
