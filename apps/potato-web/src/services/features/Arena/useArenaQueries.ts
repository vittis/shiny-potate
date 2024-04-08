import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/services/api/trpc";

const useArenaQueries = () => {
	const { client } = trpc.useUtils(); // todo fuck trpc-react, use vanilla client

	const { data, ...rest } = useQuery({
		queryKey: ["arena", "my"],
		queryFn: () => client.arena.my.query(),
		// staleTime: Infinity,
	});

	const shop = data?.shop;
	const storage = data?.storage;
	const board = data?.board;

	/* useEffect(() => {
		console.log(data?.storage);
		if (data?.storage) {
			setStorage(data?.storage);
		}
	}, [data]); */

	return { currentRun: data, shop, storage, board, ...rest };
};

export { useArenaQueries };
