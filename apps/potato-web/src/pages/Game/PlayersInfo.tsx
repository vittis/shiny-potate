import { useQuery } from "@tanstack/react-query";
import { viewBattle } from "./GameView";
import { useSearchParams } from "react-router-dom";
import { capitalizeFirstLetter } from "@/utils/string";
import { formatDistanceToNow, parseISO } from "date-fns";

const PlayersInfo = () => {
	const [searchParams] = useSearchParams();
	const gameId = searchParams.get("id");

	const { data } = useQuery({
		queryKey: ["view", "battle", gameId],
		queryFn: () => viewBattle(gameId || ""),
		enabled: !!gameId,
	});

	if (!data) {
		return null;
	}

	return (
		<>
			<div className="fixed bottom-1/2 left-4 ">
				<PlayerInfo playerInfo={data.myInfo} />
			</div>
			<div className="fixed bottom-1/2 right-4 ">
				<PlayerInfo playerInfo={data.opponentInfo} />
			</div>
		</>
	);
};

const PlayerInfo = ({ playerInfo }) => {
	return (
		<div className="flex flex-col gap-1 rounded bg-input p-2 text-center">
			<div className="text-center text-lg ">
				<span className="text-primary">{playerInfo.username}</span>
				<div className="text-center text-xs">
					<span className="text-neutral-400">
						({formatDistanceToNow(parseISO(playerInfo.createdAt))} ago)
					</span>
				</div>
			</div>

			<div className="mt-2 text-sm">Round: {playerInfo.round}</div>
			<div className="text-sm text-green-300">Wins: {playerInfo.wins}</div>
			<div className="text-sm text-red-300">Losses: {playerInfo.losses}</div>
		</div>
	);
};

export { PlayersInfo };
