import { CrownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useArenaMutations } from "@/services/features/Arena/useArenaMutations";

const ArenaDevMenu = () => {
	const {
		saveRoundSnapshot,
		saveRoundSnapshotIsPending,
		clearAllData: { mutateAsync: clearAllData, isPending: clearAllDataIsPending },
		seedData: { mutateAsync: seedData, isPending: seedDataIsPending },
	} = useArenaMutations();

	return (
		<Popover>
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<Button size="icon" variant="ghost">
								<CrownIcon size={18} className="text-primary" />
							</Button>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent>Open dev menu</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent asChild>
				<div>
					<div className="mb-4 text-center font-mono text-xl">Dev Menu 😎</div>
					<div className="flex flex-col gap-4">
						<Button
							disabled={saveRoundSnapshotIsPending}
							onClick={() => saveRoundSnapshot({ countAsWin: true })}
							variant="outline"
							className="text-green-300"
						>
							Win Round
						</Button>
						<Button
							disabled={saveRoundSnapshotIsPending}
							onClick={() => saveRoundSnapshot({ countAsWin: false })}
							variant="outline"
							className="text-red-300"
						>
							Lose Round
						</Button>
						<Button
							disabled={clearAllDataIsPending}
							onClick={() => clearAllData()}
							variant="outline"
						>
							Clear all data
						</Button>
						<Button disabled={seedDataIsPending} onClick={() => seedData()} variant="outline">
							Seed rounds
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export { ArenaDevMenu };
