import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

export const ChatBubble = ({ sender, message, isFromMe, timestamp, avatar }) => {
	console.log(avatar);

	return (
		<Tooltip>
			<div className={`chat ${isFromMe ? "chat-end" : "chat-start"}`}>
				<div className="chat-image ">
					<div className="flex w-8 h-8 rounded-full dark:bg-stone-800 bg-zinc-800 dark:text-accent-foreground text-primary-foreground items-center justify-center text-xl text-center">
						{avatar ? (
							<img src={avatar} className="w-8 h-8 rounded-full" />
						) : (
							sender?.[0]?.toUpperCase()
						)}{" "}
					</div>
				</div>
				<div className="chat-header">
					<span className="opacity-50">{sender}</span>

					<TooltipTrigger asChild>
						<time className="text-xs opacity-50 ml-1 text-muted-foreground">
							{format(new Date(timestamp), "HH:mm")}
						</time>
					</TooltipTrigger>
					<TooltipContent side="right" className="flex items-center gap-4">
						{formatDistanceToNow(new Date(timestamp))} ago
					</TooltipContent>
				</div>
				<div className="chat-bubble">{message}</div>
			</div>
		</Tooltip>
	);
};
