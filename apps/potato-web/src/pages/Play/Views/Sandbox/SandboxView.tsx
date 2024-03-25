import { Button } from "@/components/ui/button";
import { BoardSetupView } from "./BoardSetup/BoardSetupView";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { api } from "@/services/api/http";
import { TooltipSettigs } from "@/components/MarkdownTooltip/TooltipSettings";
import { useSandboxQueries } from "@/services/features/Sandbox/useSandboxQueries";
import { useSandboxStore } from "@/services/features/Sandbox/useSandboxStore";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { trpc } from "@/services/api/trpc";
import { supabase } from "@/services/supabase/supabase";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";

export async function fetchRollShop(data) {
	const response = await api.get(`/game/roll-shop/${data.tier}`);

	return response.data;
}

function SandboxView() {
	const user = useSupabaseUserStore(state => state.user);
	const [selectTier, setSelectTier] = useState("-1");

	const { refetchRollShop, isFetchingRollShop } = useSandboxQueries();
	const shopTier = useSandboxStore(state => state.shopTier);
	const setShopTier = useSandboxStore(state => state.setShopTier);

	function onClickRollShop() {
		setShopTier(selectTier);
		if (shopTier !== selectTier) {
			setShopTier(selectTier);
		} else {
			refetchRollShop();
		}
	}

	// todo remove
	useEffect(() => {
		async function test() {
			/* console.log(user.id);
			const { data, error } = await supabase.from("arena").select("*").eq("player_id", user.id);
			console.log(data); */
			/* const { data, error } = await supabase
				.from("arena")
				.insert([{ player_id: user.id }])
				.select();

			console.log(data); */
		}
		if (user) {
			test();
		}
	}, [user]);

	return (
		<ScrollArea className="h-full w-full px-4">
			<ScrollBar />
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

					<Button variant="secondary" onClick={onClickRollShop} disabled={isFetchingRollShop}>
						Roll Shop
					</Button>
				</div>
				<div className="absolute top-4 right-4">
					<TooltipSettigs />
				</div>
				{/* for testing stuff, ok to remove */}
				{/* <div className="flex flex-col items-center gap-4">
				<MarkdownTooltip content={<MarkdownContent sourcePath="Triggers/BATTLE START" />}>
					<div className="w-fit bg-green-300">oi kkkkkkk</div>
				</MarkdownTooltip>
			</div> */}
				<BoardSetupView />
			</div>
		</ScrollArea>
	);
}

export { SandboxView };
