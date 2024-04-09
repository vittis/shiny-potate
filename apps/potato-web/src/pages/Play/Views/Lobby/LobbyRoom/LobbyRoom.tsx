import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
	CircleIcon,
	ClockIcon,
	FlaskConical,
	Loader2Icon,
	LogOutIcon,
	MessageCircleIcon,
	PlayIcon,
	PlusIcon,
	SwordsIcon,
	UsersIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LobbyRoomUserRow } from "./LobbyRoomUserRow";
import { useLobbyMutations } from "@/services/features/Lobby/useLobbyMutations";
import { toast } from "react-toastify";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";

interface LobbyRoomMember {
	id: string;
	name: string;
	isCreator: boolean;
	avatar?: string;
}

interface LobbyRoomProps {
	id: string;
	name: string;
	description?: string;
	members: LobbyRoomMember[];
	maxMembers: number;
	lastUpdated: string; // todo date
	type?: "Duel" | "Free for All" | "Custom";
	isInAnyRoom?: boolean;
	listIsLoading?: boolean;
}

const LobbyRoom = ({
	id,
	name,
	description,
	members = [],
	lastUpdated,
	maxMembers,
	isInAnyRoom,
	listIsLoading,
}: LobbyRoomProps) => {
	const { joinRoom, leaveRoom, isLoading: mutationIsLoading } = useLobbyMutations();
	const supaUser = useSupabaseUserStore(state => state.user);

	const you = members.find(member => member.id === supaUser?.id);

	const isInRoom = !!you;
	const isFull = members.length === maxMembers;
	const shouldShowJoinButton = !isFull && !isInAnyRoom;
	const hasMoreThan3Members = members.length >= 3;
	const type = maxMembers > 2 ? "Free for All" : "Duel";
	const canStart = members.length >= 2 && you?.isCreator;

	const icon =
		type === "Duel" ? (
			<SwordsIcon className="mr-1 h-3 w-3 dark:fill-yellow-400 dark:text-yellow-400" />
		) : type === "Free for All" ? (
			<UsersIcon className="mr-1 h-3 w-3 dark:fill-yellow-400 dark:text-yellow-400" />
		) : (
			<FlaskConical className="dark:fill-black-800 mr-1 h-3 w-3 dark:text-yellow-400" />
		);

	async function onClickJoin() {
		await joinRoom({ userId: supaUser.id, roomId: id });
	}
	async function onClickLeave() {
		console.log("??");
		await leaveRoom({ userId: supaUser.id, roomId: id });
	}

	const orderedMembers = members.sort((a, b) => {
		if (a.isCreator) return -1; // Creator comes first
		if (a.id === supaUser?.id && !b.isCreator) return -1; // You come second
		if (b.isCreator) return 1; // Creator comes first
		if (b.id === supaUser?.id) return 1; // You come second
		return 0; // Keep the rest in the same order
	});

	function onClickStart() {
		toast.warning("This feature is not implemented yet");
	}

	const JoinButton = () => (
		<Button
			disabled={mutationIsLoading || listIsLoading}
			onClick={onClickJoin}
			size="sm"
			variant="outline"
			className="relative flex h-[30px] w-full items-center justify-between space-x-2 px-1.5 text-emerald-300 hover:text-emerald-300"
		>
			Join
			{mutationIsLoading ? (
				<Loader2Icon className="w-4 animate-spin" />
			) : (
				<PlusIcon className="w-4" />
			)}
		</Button>
	);

	return (
		<Card
			className={cn(
				"bg-pattern-gradient relative m-1 flex min-h-[180px] max-w-[420px] flex-col",
				!isInRoom && !isFull && "bg-pattern-gradient" /* glow-sm-success */,
				!isInRoom && isFull && "bg-pattern-gradient-error" /* glow-sm-error */,
			)}
		>
			<CardHeader className="flex flex-row space-y-0 px-0.5">
				<div className="w-1/2 space-y-3 px-2.5">
					<CardTitle className="text-lg">{name}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				<div className="w-1/2">
					<ScrollArea
						className={cn(
							"h-full max-h-[100px] w-full px-3.5",
							isFull && members.length >= 3 && "max-h-[136px] ",
						)}
					>
						<ScrollBar />
						<div className="space-y-1">
							{orderedMembers.map(member => (
								<LobbyRoomUserRow key={member.id} isYou={member.id === supaUser.id} {...member} />
							))}

							{shouldShowJoinButton && !hasMoreThan3Members && <JoinButton />}
						</div>
					</ScrollArea>
					{shouldShowJoinButton && hasMoreThan3Members && (
						<div className="px-2.5 pt-1">
							<JoinButton />
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="mt-3 flex flex-1 flex-col-reverse gap-2">
				<div className="flex items-center justify-between space-x-4 text-sm text-muted-foreground">
					<div className="flex space-x-3">
						<div className="flex items-center">
							{icon}
							{type}
						</div>

						<div className="flex items-center">
							<CircleIcon
								className={cn(
									"mr-1 h-3 w-3 fill-green-400 text-green-400",
									isFull && "fill-red-400 text-red-400",
								)}
							/>
							{members.length}/{maxMembers}
						</div>

						{false && (
							<div className="flex items-center gap-1 text-[12px] text-muted-foreground">
								<ClockIcon className="h-3 w-3" />
								<time dateTime="2008-02-14 20:00">{formatDistanceToNow(lastUpdated)} ago</time>
							</div>
						)}
					</div>

					<div className="flex items-center gap-1">
						{!isInRoom && (
							<div className="flex items-center gap-1 text-[12px] text-muted-foreground">
								<ClockIcon className="h-3 w-3" />
								<time dateTime="2008-02-14 20:00">
									{formatDistanceToNow(new Date(lastUpdated))} ago
								</time>
							</div>
						)}
						{isInRoom && (
							<>
								<Tooltip delayDuration={0}>
									<TooltipTrigger asChild>
										<Button
											disabled={listIsLoading || mutationIsLoading}
											onClick={onClickLeave}
											size="sm"
											variant="ghost"
											className="relative flex h-[30px] items-center justify-between px-2"
										>
											{mutationIsLoading ? (
												<Loader2Icon className="w-4 animate-spin" />
											) : (
												<LogOutIcon className="w-4 text-rose-400" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>Leave</TooltipContent>
								</Tooltip>
								<Tooltip delayDuration={0}>
									<TooltipTrigger asChild>
										<Button
											size="sm"
											variant="ghost"
											className="relative flex h-[30px] items-center justify-between px-2"
										>
											<MessageCircleIcon className="w-4 text-sky-400" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Open in messages</TooltipContent>
								</Tooltip>
								{!canStart && (
									<Tooltip delayDuration={0}>
										<TooltipTrigger asChild>
											<Button
												disabled={listIsLoading || mutationIsLoading}
												onClick={onClickStart}
												size="sm"
												variant="ghost"
												className="relative flex h-[30px] items-center justify-between px-2"
											>
												{mutationIsLoading ? (
													<Loader2Icon className="w-4 animate-spin" />
												) : (
													<PlayIcon className="w-4 animate-pulse text-emerald-400" />
												)}
											</Button>
										</TooltipTrigger>
										<TooltipContent>Start</TooltipContent>
									</Tooltip>
								)}
							</>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export { LobbyRoom };
