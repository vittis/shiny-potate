import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EquipmentMarkdownContent } from "../MarkdownContent/EquipmentMarkdownContent";
import { useTooltipStore } from "./useTooltipStore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface MarkdownTooltipProps {
	children: React.ReactNode;
	onOpenChange?: (open: boolean) => void;
	equip?: any;
}

const EquipmentTooltip = ({ children, equip, onOpenChange }: MarkdownTooltipProps) => {
	const tooltipMode = useTooltipStore(state => state.tooltipMode);
	const [open, setOpen] = useState(false);

	function finalOnOpenChange(open: boolean) {
		if (!onOpenChange) {
			setOpen(open);
			return;
		}

		onOpenChange(open);
		setOpen(open);
	}

	if (tooltipMode === "click") {
		return (
			<Popover>
				<PopoverTrigger asChild>{children}</PopoverTrigger>
				<PopoverContent className="p-0 max-w-[750px]">
					<EquipmentMarkdownContent equip={equip} />
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<TooltipProvider delayDuration={400}>
			<Tooltip open={open} onOpenChange={finalOnOpenChange}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className="p-0 w-max max-w-[750px]">
					<EquipmentMarkdownContent onOpenSubTooltip={() => setOpen(true)} equip={equip} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export { EquipmentTooltip };
