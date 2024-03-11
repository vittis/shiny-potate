import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/http";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSandboxStore } from "./useSandboxStore";

export async function fetchRollShop(data: { tier: string }) {
	const response = await api.get(`/game/roll-shop/${data.tier}`);

	return response.data;
}

interface SandboxQueriesData {
	shopData: any;
	isFetchingRollShop: boolean;
	refetchRollShop: () => void;
}

const useSandboxQueries = (): SandboxQueriesData => {
	const shopTier = useSandboxStore(state => state.shopTier);

	const {
		data: shopData,
		isSuccess: isSuccessRollShop,
		refetch: refetchRollShop,
		isFetching: isFetchingRollShop,
	} = useQuery({
		queryKey: ["sandbox", "roll-shop", shopTier],
		queryFn: () => fetchRollShop({ tier: shopTier }),
		staleTime: 0,
	});

	useEffect(() => {
		if (isSuccessRollShop) {
			toast.success("Shop generated 👌");
		}
	}, [isSuccessRollShop]);

	return { shopData, isFetchingRollShop, refetchRollShop };
};

export { useSandboxQueries };
