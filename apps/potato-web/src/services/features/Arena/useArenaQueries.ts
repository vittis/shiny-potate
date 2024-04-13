import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/services/api/trpc";
import { useSupabaseUserStore } from "../User/useSupabaseUserStore";

const useArenaQueries = () => {
	const { username } = useSupabaseUserStore();
	const { client } = trpc.useUtils(); // todo fuck trpc-react, use vanilla client

	const { data, ...rest } = useQuery({
		queryKey: ["arena", "my"],
		queryFn: () => client.arena.my.query(),
		// staleTime: Infinity,
		enabled: !!username,
	});

	const shop = data?.shop;
	const storage = data?.storage;
	const board = data?.board;

	return { currentRun: data, shop, storage, board, ...rest };
};

export { useArenaQueries };
