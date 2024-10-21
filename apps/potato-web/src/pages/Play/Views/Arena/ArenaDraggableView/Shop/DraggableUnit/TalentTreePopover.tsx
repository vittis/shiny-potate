import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ClassNodeInstance, TalentNodeInstance, TalentTreeInstance } from "game-logic";
import { NetworkIcon } from "lucide-react";
import { TalentNode } from "./TalentNode";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { setBoard } from "@/services/features/Arena/useArenaUpdate";
import { XP_TO_LEVEL } from "./LevelUnitControls";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface TalentTreePopoverProps {
	unitId: string;
	talentTrees: TalentTreeInstance[];
	utiliyNodes: ClassNodeInstance[];
}

const TalentTreePopover = ({ talentTrees, utiliyNodes, unitId }: TalentTreePopoverProps) => {
	const { board } = useArenaQueries();

	const isOnBoard = board?.some(space => space.unit?.id === unitId);

	const spentPointsInTree = talentTrees.map(tree => ({
		name: tree.name,
		pointsSpent: tree.talents.reduce((acc, val) => acc + (val.obtained ? 1 : 0), 0),
	}));

	function onObtainNode(id: string) {
		if (!board) {
			return;
		}

		setBoard(prevBoard => {
			return prevBoard.map(space => {
				const boardUnit = space.unit;

				if (boardUnit?.id === unitId) {
					return {
						...space,
						unit: {
							...boardUnit,
							unit: {
								...boardUnit.unit,
								utilityNodes: boardUnit.unit.utilityNodes.map(node => {
									if (node.id === id) {
										return {
											...node,
											obtained: true,
										};
									}
									return node;
								}),
								talentTrees: boardUnit.unit.talentTrees.map(tree => ({
									...tree,
									talents: tree.talents.map(node => {
										if (node.id === id) {
											return {
												...node,
												obtained: true,
											};
										}
										return node;
									}),
								})),
							},
						},
					};
				}

				return space;
			});
		});
	}

	const unitXp = board?.find(space => space.unit?.id === unitId)?.unit?.unit?.xp || 0;

	const canObtainNode = unitXp >= XP_TO_LEVEL; // todo implement xp to level properly

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					disabled={!isOnBoard}
					variant="outline"
					className={cn(canObtainNode && "animate-black-swoosh")}
					size="icon"
				>
					<NetworkIcon className="text-neutral-100" size={20} />
				</Button>
			</PopoverTrigger>
			<PopoverContent asChild>
				<div className="w-auto">
					<div className="relative flex w-full gap-10 px-4">
						{talentTrees.map(tree => (
							<div key={tree.name} className="flex flex-col items-center gap-2 text-center">
								<div className="mb-2 font-mono text-2xl font-semibold text-red-300">
									{tree.name}
								</div>

								{tree.talents.map(node => (
									<TalentNode
										spentPointsInTree={
											spentPointsInTree.find(t => t.name === tree.name)?.pointsSpent
										}
										key={node.id}
										node={node}
										canObtainNode={canObtainNode}
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
									canObtainNode={canObtainNode}
									onObtainNode={onObtainNode}
								/>
							))}
						</div>
					</div>

					<Separator className="my-2" />

					<div className="flex justify-center">
						<Button variant="ghost" size="sm" className="text-amber-300">
							Refund All
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export { TalentTreePopover };
