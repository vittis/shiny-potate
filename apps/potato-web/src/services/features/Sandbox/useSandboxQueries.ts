import { useQuery } from "@tanstack/react-query";
import { useSandboxStore } from "./useSandboxStore";
import { trpc } from "@/services/api/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "potato-server/src/types";

type RouterOutput = inferRouterOutputs<AppRouter>;

export async function fetchRollShop(input: { tier: string }) {
	const tier = Number(input.tier);
	const data = await trpc.sandbox.rollShop.query({ tier });

	return data;
}

interface SandboxQueriesData {
	shopData?: RouterOutput["sandbox"]["rollShop"];
	isFetchingRollShop: boolean;
	refetchRollShop: () => void;
}

const useSandboxQueries = (): SandboxQueriesData => {
	const shopTier = useSandboxStore(state => state.shopTier);

	const {
		data: shopData,
		refetch: refetchRollShop,
		isFetching: isFetchingRollShop,
	} = useQuery({
		queryKey: ["sandbox", "roll-shop", shopTier],
		queryFn: () => fetchRollShop({ tier: shopTier }),
		staleTime: 0,
	});

	return { shopData, isFetchingRollShop, refetchRollShop };
};

export { useSandboxQueries };
