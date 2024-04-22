import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TalentNodeInstance } from "game-logic";
import { AwardIcon, CheckIcon } from "lucide-react";

interface TalentNodeProps {
	node: TalentNodeInstance;
	spentPointsInTree?: number;
	onObtainNode: (id: string) => void;
	canObtainNode: boolean;
}

const TalentNode = ({ node, spentPointsInTree, canObtainNode, onObtainNode }: TalentNodeProps) => {
	const isRequirementMet = spentPointsInTree !== undefined ? spentPointsInTree >= node.req : false;
	const isDisabled = !canObtainNode || !isRequirementMet;

	function onClickObtainNode() {
		if (node.obtained || isDisabled) return;

		onObtainNode(node.id);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					onClick={() => onClickObtainNode()}
					variant={node.obtained ? "ghost" : "outline"}
					size="icon"
					className={cn(
						node.obtained && "cursor-default hover:bg-transparent",
						isDisabled && "opacity-50 hover:cursor-default hover:bg-inherit",
					)}
				>
					{node.obtained ? (
						<CheckIcon className="text-green-400" />
					) : (
						<AwardIcon className="text-neutral-100" size={20} />
					)}
					{!isRequirementMet && <span className="text-[10px] text-red-400">{node.req}</span>}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{node.description}</TooltipContent>
		</Tooltip>
	);
};

export { TalentNode };
