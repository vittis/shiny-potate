import { trpc } from "@/services/api/trpc";
import { useQuery } from "@tanstack/react-query";

const useGamesHistoryQueries = () => {
	const { client } = trpc.useUtils(); // todo fuck trpc-react, use vanilla client

	const result = useQuery({
		queryKey: ["profile", "history"],
		queryFn: () => client.profile.gamesHistory.query(),
	});

	return result;
};

export { useGamesHistoryQueries };
