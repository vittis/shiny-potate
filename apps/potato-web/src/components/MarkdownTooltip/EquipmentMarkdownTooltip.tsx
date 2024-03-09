import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EquipmentMarkdownContent } from "../MarkdownContent/EquipmentMarkdownContent";

interface MarkdownTooltipProps {
	children: React.ReactNode;
	onOpenChange?: (open: boolean) => void;
	equip?: any;
}

const EquipmentTooltip = ({ children, equip, onOpenChange }: MarkdownTooltipProps) => {
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
					<EquipmentMarkdownContent parentTooltipSetOpen={setOpen} equip={equip} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export { EquipmentTooltip };
