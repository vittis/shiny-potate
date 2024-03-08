import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";

interface MarkdownTooltipProps {
	children: React.ReactNode;
	sourcePath: string;
}

const MarkdownTooltip = ({ children, sourcePath }: MarkdownTooltipProps) => {
	return (
		<TooltipProvider delayDuration={300}>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent>
					<MarkdownContent sourcePath={sourcePath} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export { MarkdownTooltip };
