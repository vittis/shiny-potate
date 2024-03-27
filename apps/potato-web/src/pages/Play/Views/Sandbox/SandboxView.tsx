import { Button } from "@/components/ui/button";
import { BoardSetupView } from "./BoardSetup/BoardSetupView";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { TooltipSettigs } from "@/components/MarkdownTooltip/TooltipSettings";
import { useSandboxQueries } from "@/services/features/Sandbox/useSandboxQueries";
import { useSandboxStore } from "@/services/features/Sandbox/useSandboxStore";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function SandboxView() {
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
