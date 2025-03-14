import useWebSocket from "react-use-websocket";
import { useMemo } from "react";
import { SOCKET_URL } from "@/services/api/websocket";
import { queryClient } from "@/services/api/queryClient";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/http";
import { useSupabaseUserStore } from "../User/useSupabaseUserStore";

async function fetchChatMessages(channel: string) {
	const { data } = await api.get(`/api/chat/${channel}`, {
		withCredentials: true,
	});
	return data;
}

// todo adjust to allow many channels properly
const useChatMessages = ({ channel }: { channel: string }) => {
	const user = useSupabaseUserStore(state => state.user);
	const username = useSupabaseUserStore(state => state.username);
	const userAvatar = user?.identities[0]?.identity_data?.avatar_url;

	const searchParams = useMemo(() => {
		if (!user?.id || !username) return undefined;

		const params = new URLSearchParams({ userId: user?.id });
		params.append("channels", "chat");
		params.append("channels", channel);
		params.append("name", username);
		if (userAvatar) {
			params.append("avatar", userAvatar);
			return params.toString();
		}
	}, [user, username, channel]);

	const { data: messagesData, isLoading: messagesLoading } = useQuery<{ data: any[] }>({
		queryKey: ["chat", channel],
		queryFn: () => fetchChatMessages(channel),
		enabled: !!username,
	});

	const { sendMessage: sendChatMessage } = useWebSocket(
		`${SOCKET_URL}/?${searchParams}`,
		{
			share: true,
			onMessage: event => {
				const data = JSON.parse(event.data);
				console.log(data);

				if (data.type === "chat_message") {
					console.log("chat message received-> ", data.message);
					console.log(data);

					queryClient.setQueryData(["chat", channel], (oldData: any) => {
						return {
							data: [
								...oldData.data,
								{
									message: data.message,
									timestamp: data.timestamp,
									avatar: data.avatar,
									id: data.id,
								},
							],
						};
					});
				}
			},
		},
		!!searchParams,
	);

	const messages = useMemo(() => {
		if (!messagesData?.data) return [];
		return messagesData.data.map(messageObj => {
			const sender = messageObj.message.split("^")?.[0];
			const message = messageObj.message.split("^")?.[1];
			return {
				sender,
				message,
				timestamp: messageObj.timestamp,
				avatar: messageObj.avatar,
				id: messageObj.id,
			};
		});
	}, [messagesData]);

	return { sendChatMessage, messages, messagesLoading };
};

export { useChatMessages };
