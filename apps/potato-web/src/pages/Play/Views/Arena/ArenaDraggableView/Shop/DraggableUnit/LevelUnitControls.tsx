import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { Plus } from "lucide-react";

interface LevelUnitControlsProps {}

const LevelUnitControls = ({}: LevelUnitControlsProps) => {
	const { currentRun } = useArenaQueries();

	if (!currentRun) {
		return null;
	}

	const canLevel = currentRun?.xp > 0;

	return (
		<div className="flex gap-2 rounded bg-input py-0.5">
			<div className="flex items-center">
				<span className={cn("ml-2 font-mono text-[12px] font-semibold text-neutral-100")}>
					Lv 1
				</span>
			</div>
			<div className="relative flex items-center">
				<Progress value={-1} className="h-[12px] w-[60px]" />
				<div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-[10px] text-zinc-200">
					0/2
				</div>
			</div>

			<Button
				disabled={!canLevel}
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
