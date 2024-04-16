import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TalentNodeInstance } from "game-logic";
import { AwardIcon, CheckIcon } from "lucide-react";

interface TalentNodeProps {
	node: TalentNodeInstance;
	spentPointsInTree?: number;
	onObtainNode: (id: string) => void;
}

const TalentNode = ({ node, spentPointsInTree, onObtainNode }: TalentNodeProps) => {
	const disabled = spentPointsInTree !== undefined ? node.req > spentPointsInTree : false;

	function onClickObtainNode() {
		if (node.obtained) return;

		onObtainNode(node.id);
	}

	return (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>
				<Button
					onClick={() => onClickObtainNode()}
					disabled={disabled}
					variant={node.obtained ? "ghost" : "outline"}
					size="icon"
					className={cn(node.obtained && "cursor-default hover:bg-transparent")}
				>
					{node.obtained ? (
						<CheckIcon className="text-green-400" />
					) : (
						<AwardIcon className="text-neutral-100" size={20} />
					)}
					{disabled && <span className="text-[10px] text-red-400">{node.req}</span>}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{node.description}</TooltipContent>
		</Tooltip>
	);
};

export { TalentNode };
