import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";

export const ChatBubble = ({ sender, message, isFromMe, timestamp, avatar }) => {
	return (
		<Tooltip>
			<div className={`chat ${isFromMe ? "chat-end" : "chat-start"}`}>
				<div className="chat-image ">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-center text-xl text-primary-foreground dark:bg-stone-800 dark:text-accent-foreground">
						{avatar ? (
							<img src={avatar} className="h-8 w-8 rounded-full" />
						) : (
							sender?.[0]?.toUpperCase()
						)}{" "}
					</div>
				</div>
				<div className="chat-header">
					<span className="opacity-50">{sender}</span>

					<TooltipTrigger asChild>
						<time className="ml-1 text-xs text-muted-foreground opacity-50">
							{formatDistanceToNow(new Date(timestamp))} ago
						</time>
					</TooltipTrigger>
					<TooltipContent side="right" className="flex items-center gap-4">
						{format(new Date(timestamp), "HH:mm")}
					</TooltipContent>
				</div>
				<div className="chat-bubble">{message}</div>
			</div>
		</Tooltip>
	);
};
