import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/services/api/trpc";

const useArenaQueries = () => {
	const { client } = trpc.useUtils(); // todo fuck trpc-react, use vanilla client

	const { data, ...rest } = useQuery({
		queryKey: ["arena", "my"],
		queryFn: () => client.arena.my.query(),
	});

	const shop = data?.[0]?.shop;

	return { currentRun: data?.[0], shop, ...rest };
};

export { useArenaQueries };
