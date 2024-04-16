import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ClassNodeInstance, TalentNodeInstance, TalentTreeInstance } from "game-logic";
import { NetworkIcon } from "lucide-react";
import { TalentNode } from "./TalentNode";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { setBoard, setCrazyBoard } from "@/services/features/Arena/useArenaUpdate";

interface TalentTreePopoverProps {
	talentTrees: TalentTreeInstance[];
	utiliyNodes: ClassNodeInstance[];
}

const TalentTreePopover = ({ talentTrees, utiliyNodes }: TalentTreePopoverProps) => {
	const { board } = useArenaQueries();

	const spentPointsInTree = talentTrees.map(tree => ({
		name: tree.name,
		pointsSpent: tree.talents.reduce((acc, val) => acc + (val.obtained ? 1 : 0), 0),
	}));

	function onObtainNode(id: string) {
		console.log("on click obtain", id);
		if (!board) {
			return;
		}

		setCrazyBoard(prevBoard => {
			console.log(prevBoard);
			return "xiba";
		});
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" /* className="animate-black-swoosh" */ size="icon">
					<NetworkIcon className="text-neutral-100" size={20} />
				</Button>
			</PopoverTrigger>
			<PopoverContent asChild>
				<div className="flex w-full gap-10 px-4">
					{talentTrees.map(tree => (
						<div key={tree.name} className="flex flex-col items-center gap-2 text-center">
							<div className="mb-2 font-mono text-2xl font-semibold text-red-300">{tree.name}</div>

							{tree.talents.map(node => (
								<TalentNode
									spentPointsInTree={spentPointsInTree.find(t => t.name === tree.name)?.pointsSpent}
									key={node.id}
									node={node}
									onObtainNode={onObtainNode}
								/>
							))}
						</div>
					))}

					<div className="flex flex-col items-center gap-2 text-center">
						<div className="mb-2 font-mono text-2xl font-semibold text-slate-300">Utility</div>
						{utiliyNodes.map(node => (
							<TalentNode
								key={node.id}
								node={node as TalentNodeInstance}
								onObtainNode={onObtainNode}
							/>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export { TalentTreePopover };
