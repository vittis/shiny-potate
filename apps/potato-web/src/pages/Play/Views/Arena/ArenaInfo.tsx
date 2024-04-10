import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { Loader2 } from "lucide-react";

function ArenaInfo() {
	const { currentRun, isFetching } = useArenaQueries();

	if (!currentRun) {
		return null;
	}

	return (
		<div className="flex items-center gap-4">
			<div>Round: {currentRun.round}</div>
			<div className="text-green-300">Wins: {currentRun.wins}</div>
			<div className="text-red-300">Losses: {currentRun.losses}</div>
			<div className="text-yellow-300">Gold: {currentRun.gold}</div>
			<div className="text-sky-300">XP: {currentRun.xp}</div>
			{isFetching && <Loader2 size={16} className="animate-spin" />}
		</div>
	);
}

export { ArenaInfo };
