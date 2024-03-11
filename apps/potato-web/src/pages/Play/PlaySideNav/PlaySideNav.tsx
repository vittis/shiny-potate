import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PlaySideNavItems } from "./PlaySideNavItems";
import { AlertCircle, DoorClosed, FlaskConical, Swords, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { matchPath, useLocation } from "react-router-dom";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";

interface PlaySideNavProps {
	defaultCollapsed: boolean;
	defaultSize: number;
	navCollapsedSize: number;
}

const PlaySideNav = ({ defaultCollapsed, defaultSize, navCollapsedSize }: PlaySideNavProps) => {
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

	const user = useSupabaseUserStore(state => state.user);
	const username =
		user?.user_metadata?.user_name ||
		user?.user_metadata?.username ||
		user?.user_metadata?.name ||
		user?.user_metadata?.preferred_username ||
		user?.user_metadata?.name ||
		user?.email;

	const { pathname } = useLocation();

	return (
		<>
			<ResizablePanel
				defaultSize={defaultSize}
				collapsedSize={navCollapsedSize}
				collapsible={true}
				minSize={11}
				maxSize={18}
				onExpand={() => {
					setIsCollapsed(false);
				}}
				onCollapse={() => {
					setIsCollapsed(true);
				}}
				className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
			>
				<div
					className={cn(
						"flex h-[52px] items-center justify-start",
						isCollapsed ? "h-[52px]" : "px-2",
					)}
				>
					{username ? (
						<Button
							variant="ghost"
							className={cn(
								"w-full flex items-center space-x-1 justify-start px-2",
								isCollapsed && "px-1 justify-center",
							)}
						>
							<div className="w-5 h-5 rounded-full dark:bg-stone-800 bg-zinc-800 dark:text-accent-foreground text-primary-foreground flex items-center justify-center text-xs">
								{username?.[0]?.toUpperCase()}
							</div>

							{!isCollapsed && (
								<div
									className={`flex text-ellipsis overflow-hidden text-sm text-left items-baseline gap-1`}
								>
									{username} <span className="text-[10px] text-primary">In lobby</span>
								</div>
							)}
						</Button>
					) : (
						<div className="text-xs text-muted-foreground text-center w-full">
							You're not signed in
						</div>
					)}
				</div>
				<Separator />
				<PlaySideNavItems
					isCollapsed={isCollapsed}
					links={[
						{
							title: "Matchmaking",
							label: "",
							icon: Swords,
							variant: "ghost",
							selected: !!matchPath("/arena/setup", pathname),
							path: "arena",
						},
						{
							title: "Rooms",
							label: "",
							icon: DoorClosed,
							variant: "ghost",
							selected: !!matchPath("/play/rooms", pathname),
							path: "rooms",
						},
						{
							title: "Tournaments",
							label: "",
							icon: Trophy,
							variant: "ghost",
							selected: false,
							props: {
								disabled: true,
							},
							path: "#",
						},
						{
							title: "Sandbox",
							label: "",
							icon: FlaskConical,
							variant: "ghost",
							selected: !!matchPath("/play/sandbox", pathname),
							path: "sandbox",
						},
					]}
				/>
				<Separator />
				<PlaySideNavItems
					isCollapsed={isCollapsed}
					links={[
						{
							title: "Profile",
							label: "1",
							icon: User,
							variant: "ghost",
							selected: false,
							props: {
								disabled: true,
							},
							path: "#",
						},
						{
							title: "Updates",
							label: "342",
							icon: AlertCircle,
							variant: "ghost",
							selected: false,
							props: {
								disabled: true,
							},
							path: "#",
						},
					]}
				/>
			</ResizablePanel>
			<ResizableHandle withHandle />
		</>
	);
};

export { PlaySideNav };
