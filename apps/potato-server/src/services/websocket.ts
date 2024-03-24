import { randomUUID } from "crypto";
import { WebSocketServer, WebSocket } from "ws";
import type { Server as HTTPSServer } from "node:http";
import { redisClient } from "./redis";

interface wsConnection {
	socket: WebSocket;
	userId?: string;
	channels: string[];
}

class WebsocketService {
	static wsConnections: wsConnection[] = [];

	static init(server: HTTPSServer) {
		const wss = new WebSocketServer({ server });

		wss.on("connection", async (ws, req) => {
			console.log("connecting into: ", req.url);

			const urlParams = new URLSearchParams(req.url?.replace("/", "") || "");
			const userId = urlParams.get("userId");
			if (!userId) {
				console.log("userId not provided, closing connection");
				ws.close();
				return;
			}

			const channels = urlParams.getAll("channels");

			WebsocketService.wsConnections.push({
				socket: ws,
				userId,
				channels,
			});

			const isGlobal = channels.includes("global");

			const name = urlParams.get("name");
			const avatar = urlParams.get("avatar");
			if (isGlobal) {
				if (!name) {
					console.log("name not provided in Global, closing connection");
					ws.close();
					return;
				}

				await redisClient
					.multi()
					.sAdd("online_users", userId)
					.hSet("online_users_data", userId, JSON.stringify({ id: userId, name }))
					.exec();
			}

			ws.on("error", console.error);

			ws.on("message", (data: any) => {
				if (channels.includes("chat") && channels.includes("lobby")) {
					const msg = data?.toString();
					if (!msg) return;
					const finalMsg = `${name}^${msg}`;

					const id = randomUUID();

					const timestamp = Date.now();

					redisClient.rPush(
						`chat:lobby:messages`,
						JSON.stringify({
							message: finalMsg,
							timestamp,
							avatar: avatar,
							id: id,
						}),
					);

					redisClient.publish(
						"live-chat",
						JSON.stringify({
							type: "chat_message",
							message: finalMsg,
							channel: "lobby",
							timestamp,
							id: id,
							avatar: avatar,
						}),
					);
				}
			});

			ws.on("close", async () => {
				WebsocketService.wsConnections.splice(
					WebsocketService.wsConnections.findIndex(c => c.userId === userId),
					1,
				);
				if (isGlobal) {
					const userRooms = await redisClient.sMembers(`user_rooms:${userId}`);

					if (!userRooms || userRooms?.length === 0) {
						redisClient
							.multi()
							.sRem("online_users", userId)
							.hDel("online_users_data", userId)
							.exec();
						return;
					}
				}
			});
		});
	}
}

export { WebsocketService };
