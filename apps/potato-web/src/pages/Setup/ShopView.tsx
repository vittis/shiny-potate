import { Button } from "@/components/ui/button";
import { SetupView } from "./SetupView";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/http";
import { toast } from "react-toastify";

export async function fetchRollShop(data) {
	const response = await api.get(`/game/roll-shop/${data.tier}`);

	return response.data;
}

export function ShopView() {
	const [tier, setTier] = useState("0");
	const [selectTier, setSelectTier] = useState("0");

	const { isSuccess: isSuccessRollShop, refetch } = useQuery({
		queryKey: ["roll-shop", tier],
		queryFn: () => fetchRollShop({ tier }),
		staleTime: Infinity,
	});

	useEffect(() => {
		if (isSuccessRollShop) {
			toast.success("Shop rolled :)");
		}
	}, [isSuccessRollShop]);

	function onClickRollShop() {
		if (tier !== selectTier) {
			setTier(selectTier);
		} else {
			refetch();
		}
	}

	return (
		<>
			<div className="w-full flex gap-4 p-4 items-center justify-center flex-wrap">
				<div className="flex mb-1 font-semibold">Tier: </div>

				<Select value={selectTier} onValueChange={setSelectTier}>
					<SelectTrigger className="w-[60px]">
						<SelectValue placeholder="Item Tier" />
					</SelectTrigger>
					<SelectContent>
						{Array.from(Array(6)).map((_, index) => (
							<SelectItem key={index.toString()} value={index.toString()}>
								{index.toString()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Button variant="secondary" onClick={onClickRollShop}>
					Roll Shop
				</Button>
			</div>
			<SetupView tier={tier} />
		</>
	);
}
