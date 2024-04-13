import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TalentTreeInstance } from "game-logic";
import { NetworkIcon } from "lucide-react";

interface TalentTreePopoverProps {
	talentTrees: TalentTreeInstance[];
}

const TalentTreePopover = ({ talentTrees }: TalentTreePopoverProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" /* className="animate-black-swoosh" */ size="sm">
					<NetworkIcon className="text-neutral-100" size={20} />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				{talentTrees.map(tree => (
					<div key={tree.name} className="flex flex-col gap-2">
						<div className="text-lg font-semibold text-red-300">{tree.name}</div>
						{tree.talents.map(node => (
							<div key={node.id} className="flex flex-col gap-1">
								{node.description}
							</div>
						))}
					</div>
				))}
			</PopoverContent>
		</Popover>
	);
};

export { TalentTreePopover };
