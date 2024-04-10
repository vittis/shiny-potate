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
import { trpc } from "@/services/api/trpc";
import { useGamesHistoryQueries } from "@/services/features/Profile/useGamesHistoryQueries";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ArrowRight, EyeIcon, Loader2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProfileView() {
	const { data: gameHistory, isPending, error } = useGamesHistoryQueries();

	const navigate = useNavigate();

	if (error) {
		return <>deu ruim pai</>;
	}

	if (isPending || gameHistory === undefined) {
		return <Loader2Icon className="w-4 animate-spin" />;
	}

	const onClickViewGame = (gameId: string) => {
		console.log("view game", gameId);
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

			<Table className="mx-auto mt-10 max-w-[400px]">
				<TableCaption>Your game history</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Id</TableHead>
						<TableHead className="w-[100px]">Date</TableHead>
						<TableHead>My Board Id</TableHead>
						<TableHead>Opponent Board Id</TableHead>
						<TableHead>Winner</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{gameHistory?.map(game => (
						<TableRow key={game.id}>
							<TableCell className="">{game.id}</TableCell>
							<TableCell className="flex h-full w-max items-center justify-center font-medium">
								{formatDistanceToNow(parseISO(game.created_at))}
							</TableCell>
							<TableCell>{game.board_id}</TableCell>
							<TableCell>{game.opponent_board_id}</TableCell>
							<TableCell>{game.winner_id}</TableCell>
							<TableCell className="text-right">
								<UnlockButton onClick={() => onClickViewGame(game.id)} icon={<ArrowRight />}>
									<EyeIcon />
								</UnlockButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* <div>
			{gameHistory.map(game => (
				<div>{game.id}</div>
			))}
		</div> */}
		</>
	);
}

export { ProfileView };
