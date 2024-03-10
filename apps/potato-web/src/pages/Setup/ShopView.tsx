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
import { MarkdownTooltip } from "@/components/MarkdownTooltip/MarkdownTooltip";
import { TooltipActivationRadioGroup } from "@/components/MarkdownTooltip/TooltipActivationRadioGroup";

export async function fetchRollShop(data) {
	const response = await api.get(`/game/roll-shop/${data.tier}`);

	return response.data;
}

export function ShopView() {
	const [tier, setTier] = useState("-1");
	const [selectTier, setSelectTier] = useState("-1");

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
		<div className="relative">
			<div className="w-full flex gap-4 p-4 items-center justify-center flex-wrap">
				<div className="flex mb-1 font-semibold">Tier: </div>

				<Select value={selectTier} onValueChange={setSelectTier}>
					<SelectTrigger className="w-max">
						<SelectValue placeholder="Item Tier" />
					</SelectTrigger>
					<SelectContent>
						{Array.from(Array(7)).map((_, index) => (
							<SelectItem key={index.toString()} value={(index - 1).toString()}>
								{index === 0 ? "Random" : (index - 1).toString()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Button variant="secondary" onClick={onClickRollShop}>
					Roll Shop
				</Button>
			</div>

			<div className="absolute top-4 right-4">
				<TooltipActivationRadioGroup />
			</div>

			<div className="flex flex-col items-center gap-4">
				<MarkdownTooltip sourcePath="Triggers/BATTLE START">
					<div className="w-fit bg-green-300">oi kkkkkkk</div>
				</MarkdownTooltip>
			</div>

			<SetupView tier={tier} />
		</div>
	);
}
