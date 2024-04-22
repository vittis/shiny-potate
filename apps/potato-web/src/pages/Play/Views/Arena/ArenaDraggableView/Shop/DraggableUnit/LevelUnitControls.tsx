import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { queryClient } from "@/services/api/queryClient";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { setBoard } from "@/services/features/Arena/useArenaUpdate";
import { UnitInfo } from "game-logic";
import { Minus, Plus } from "lucide-react";

// todo implement xp to level properly
export const XP_TO_LEVEL = 2;

interface LevelUnitControlsProps {
	unitId: string;
	unitInfo: UnitInfo;
}

const LevelUnitControls = ({ unitId, unitInfo }: LevelUnitControlsProps) => {
	const { currentRun, board, shop } = useArenaQueries();

	const isOnShop = shop?.units?.some(shopUnit => shopUnit.id === unitId);
	const isOnBoard = board?.some(space => space.unit?.id === unitId);

	if (!currentRun || isOnShop) {
		return null;
	}

	const canLevelUp = currentRun?.xp > 0 && unitInfo.xp < XP_TO_LEVEL && isOnBoard;
	const canRemoveXp = unitInfo.xp > 0 && isOnBoard;

	const onClickLevelUpOrDown = ({ remove }: { remove: boolean }) => {
		if (!board) {
			return;
		}

		const xpToModify = remove ? -1 : 1;

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
								xp: boardUnit.unit.xp + xpToModify,
							},
						},
					};
				}

				return space;
			});
		});

		// todo extract this
		queryClient.setQueryData(["arena", "my"], (oldData: any) => {
			return {
				...oldData,
				xp: oldData.xp - xpToModify,
			};
		});
	};

	// between 0 and 100
	const fillValue = (unitInfo.xp / XP_TO_LEVEL) * 100 || -1;

	return (
		<div className="flex gap-1 rounded bg-input py-0.5">
			<div className={cn("flex items-center", unitInfo.xp === 0 && "mr-2")}>
				<span className={cn("ml-2 font-mono text-[12px] font-semibold text-neutral-100")}>
					Lv {unitInfo.level}
				</span>
			</div>

			<Button
				disabled={!canRemoveXp}
				onClick={() => onClickLevelUpOrDown({ remove: true })}
				variant="ghost"
				size="smIcon"
				className="hover:bg-neutral-600"
			>
				<Minus className="text-sky-300" size={20} />
			</Button>

			<div className="relative flex items-center">
				<Progress value={fillValue} className="h-[12px] w-[60px]" />
				<div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-[10px] text-zinc-200">
					{unitInfo.xp}/{XP_TO_LEVEL}
				</div>
			</div>

			<Button
				disabled={!canLevelUp}
				onClick={() => onClickLevelUpOrDown({ remove: false })}
				variant="ghost"
				size="smIcon"
				className="mr-1 hover:bg-neutral-600"
			>
				<Plus className="text-sky-300" size={20} />
			</Button>
		</div>
	);
};

export { LevelUnitControls };
