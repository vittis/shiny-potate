import { useSandboxStore } from "./useSandboxStore";
import { trpc } from "@/services/api/trpc";

const useSandboxQueries = () => {
	const shopTier = useSandboxStore(state => state.shopTier);

	const { data, refetch, isFetching } = trpc.sandbox.rollShop.useQuery({ tier: Number(shopTier) });

	return { shopData: data, isFetchingRollShop: isFetching, refetchRollShop: refetch };
};

export { useSandboxQueries };
