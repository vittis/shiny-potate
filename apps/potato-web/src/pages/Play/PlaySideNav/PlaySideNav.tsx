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
	const username = useSupabaseUserStore(state => state.username);

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
				className={cn(
					/* "animate-gray-fluff", */
					isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
				)}
			>
				<div
					className={cn(
						"flex h-[52px] items-center justify-start ",
						isCollapsed ? "h-[52px]" : "px-2",
					)}
				>
					{username ? (
						<Button
							variant="ghost"
							className={cn(
								"flex w-full items-center justify-start space-x-1 px-2",
								isCollapsed && "justify-center px-1",
							)}
						>
							<div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs text-primary-foreground dark:bg-stone-800 dark:text-accent-foreground">
								{username?.[0]?.toUpperCase()}
							</div>

							{!isCollapsed && (
								<div
									className={`flex items-baseline gap-1 overflow-hidden text-ellipsis text-left text-sm`}
								>
									{username} <span className="text-[10px] text-primary">In lobby</span>
								</div>
							)}
						</Button>
					) : (
						<div className="w-full text-center text-xs text-muted-foreground">
							You're not signed in
						</div>
					)}
				</div>
				<Separator />
				<PlaySideNavItems
					isCollapsed={isCollapsed}
					links={[
						{
							title: "Arena",
							label: "",
							icon: Swords,
							variant: "ghost",
							selected: !!matchPath("/play/arena", pathname),
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
