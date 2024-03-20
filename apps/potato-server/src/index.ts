import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { WebSocketServer, WebSocket } from "ws";
import type { Server as HTTPSServer } from "node:http";
import { connectRedis, redisClient, redisSub } from "./redis";
import { logger } from "hono/logger";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import gameRoutes from "./controllers/game/gameRoutes";
import arenaRoutes from "./controllers/arena/arenaRoute";
import { jwt } from "hono/jwt";

import { uniqueNamesGenerator, starWars } from "unique-names-generator";
import { randomUUID } from "node:crypto";

export type Variables = {
	session: any;
};

const APPID = process.env.APPID;
const PORT = process.env.PORT || 8080;

const app = new Hono<{ Variables: Variables }>();

app.use("*", prettyJSON()); // With options: prettyJSON({ space: 4 })

app.use(
	"*",
	cors({
		origin: process.env.FRONTEND_URL || "",
		/* origin: "http://localhost:5173", */
		credentials: true,
	}),
);

app.use("*", logger());
const wsConnections: {
	socket: WebSocket;
	userId?: string;
	channels: string[];
}[] = [];

app.use("/api/*", (c, next) => {
	const jwtMiddleware = jwt({
		secret: process.env.JWT_SECRET ?? "",
	});
	return jwtMiddleware(c, next);
});

app.use("/arena/*", (c, next) => {
	const jwtMiddleware = jwt({
		secret: process.env.JWT_SECRET ?? "",
	});
	return jwtMiddleware(c, next);
});

app.route("/game", gameRoutes);
app.route("/arena", arenaRoutes);

app.post("/login", async c => {
	// You would typically validate user credentials here
	let randomUserId = Math.floor(Math.random() * 1000);
	const userData = {
		name: uniqueNamesGenerator({
			dictionaries: [starWars],
		}),
		userId: randomUserId,
	};

	const sId = getCookie(c, "sId");

	if (sId) {
		const sessionData = await redisClient.hGetAll(`session:${sId}`);

		if (Object.keys(sessionData).length > 0) {
			return c.json({ message: "You are already logged in" }, 500);
		}
	}

	// Create a session
	const sessionId = Math.floor(Math.random() * 1000).toString();
	redisClient.hSet(`session:${sessionId}`, userData);

	// Set the session ID as a cookie
	setCookie(c, "sId", sessionId, {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	});

	return c.json({ ok: true });
});

app.post("/logout", async c => {
	const sId = getCookie(c, "sId");

	if (!sId) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	// Delete the session from Redis
	await redisClient.del(`session:${sId}`);

	// Delete the session ID cookie
	deleteCookie(c, "sId");

	return c.json({ ok: true });
});

app.get("/api/chat/:channel", async c => {
	const channel = c.req.param("channel");
	const allMessages = await redisClient.lRange(`chat:${channel}:messages`, 0, -1);

	return c.json({
		data: allMessages.map(m => JSON.parse(m)),
	});
});

app.post("api/chat/:channel/:message", async c => {
	const channel = c.req.param("channel");
	const msg = c.req.param("message");
	const finalMsg = `${c.get("session").name}: ${msg}`;

	const session = c.get("session");

	redisClient.rPush(
		`chat:${channel}:messages`,
		JSON.stringify({
			message: finalMsg,
			timestamp: Date.now(),
		}),
	);

	await redisClient.publish("live-chat", JSON.stringify({ message: finalMsg, channel }));

	return c.json({
		message: `published successfully by ${session.name} ${APPID}`,
	});
});

const connectAll = async () => {
	await connectRedis();

	await redisSub.subscribe("live-chat", message => {
		const parsedMessage = JSON.parse(message);

		wsConnections.forEach(c => {
			if (!c.channels.includes(parsedMessage.channel)) return;
			c.socket.send(JSON.stringify(parsedMessage));
		});
	});
};

connectAll().then(() => {
	const server = serve({ fetch: app.fetch, port: Number(PORT) }, info => {
		console.log(
			`${APPID} Listening on port ${info.port}  at ${info.address}: http://${info.address}:${info.port}. To access, check HAProxy config, probably http://${info.address}:8080`,
		);
	});

	const wss = new WebSocketServer({ server: server as HTTPSServer });

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

		wsConnections.push({
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

		ws.on("message", data => {
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
			wsConnections.splice(
				wsConnections.findIndex(c => c.userId === userId),
				1,
			);
			if (isGlobal) {
				const userRooms = await redisClient.sMembers(`user_rooms:${userId}`);

				if (!userRooms || userRooms?.length === 0) {
					redisClient.multi().sRem("online_users", userId).hDel("online_users_data", userId).exec();
					return;
				}
			}
		});
	});
});
