import { UnlockButton } from "@/components/ui/buttonUnlock";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGamesHistoryQueries } from "@/services/features/Profile/useGamesHistoryQueries";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { capitalizeFirstLetter } from "@/utils/string";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ArrowRight, EyeIcon, Loader2Icon } from "lucide-react";
import { Database } from "potato-server/types/supabase";
import { useNavigate } from "react-router-dom";

function ProfileView() {
	const { username } = useSupabaseUserStore();
	const { data: gameHistory, isPending, error } = useGamesHistoryQueries();

	const navigate = useNavigate();

	if (error) {
		return <>Error</>;
	}

	const onClickViewGame = (gameId: string) => {
		navigate(`/game?id=${gameId}`);
	};

	return (
		<>
			<div className="relative">
				<div className="breadcrumbs flex h-[52px] items-center px-4">
					<ul>
						<li>
							<h1 className="text-lg font-bold">Play</h1>
						</li>
						<li>
							<h2 className="text-md font-bold text-muted-foreground">Profile</h2>
						</li>
					</ul>
				</div>
			</div>

			<Separator />

			{isPending && (
				<div className="mt-10 flex justify-center">
					<Loader2Icon className="flex w-12 animate-spin justify-center" />
				</div>
			)}
			{!isPending && (
				<Table className="mx-auto mt-10 max-w-[400px]">
					<TableCaption>Your game history</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>When</TableHead>
							<TableHead>Round</TableHead>
							<TableHead>Wins</TableHead>
							<TableHead>Losses</TableHead>
							<TableHead>Opponent</TableHead>
							<TableHead>Winner</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{gameHistory?.map(game => {
							const myBoard =
								game.my_board as unknown as Database["public"]["Tables"]["board"]["Row"];

							const opponentProfile =
								game.opponent_profile as unknown as Database["public"]["Tables"]["profiles"]["Row"];

							const winner =
								game.winner as unknown as Database["public"]["Tables"]["profiles"]["Row"];
							return (
								<TableRow key={game.id}>
									<TableCell>
										<div className="w-max text-center">
											{capitalizeFirstLetter(formatDistanceToNow(parseISO(game.created_at)))} ago
										</div>
									</TableCell>
									<TableCell>
										<div className="w-full text-center">{myBoard.round}</div>
									</TableCell>
									<TableCell>
										<div className="w-full text-center text-green-300">{myBoard.wins}</div>
									</TableCell>
									<TableCell>
										<div className="w-full text-center text-red-300">{myBoard.losses}</div>
									</TableCell>
									<TableCell>
										<div className="w-max text-center ">
											{opponentProfile.username ?? "no_username"}
										</div>
									</TableCell>
									<TableCell>
										<div
											className={cn(
												"w-max text-center",
												username === winner.username ? "text-green-300" : "text-red-400",
											)}
										>
											{winner.username}{" "}
											{username === winner.username && (
												<span className="text-xs text-neutral-300">(you)</span>
											)}
										</div>
									</TableCell>
									<TableCell>
										<UnlockButton
											size="sm"
											onClick={() => onClickViewGame(game.id)}
											icon={<ArrowRight />}
										>
											<EyeIcon />
										</UnlockButton>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			)}

			{/* <div>
			{gameHistory.map(game => (
				<div>{game.id}</div>
			))}
		</div> */}
		</>
	);
}

export { ProfileView };
