import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { connectRedis, redisClient, redisSub } from "./services/redis";
import { logger } from "hono/logger";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import gameRoutes from "./controllers/game/gameRoutes";
import arenaRoutes from "./controllers/arena/arenaRoutes";
import { jwt } from "hono/jwt";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routes/routes";
import { WebsocketService } from "./services/websocket";
import type { Server as HTTPSServer } from "node:http";
import { createTRPCContext } from "./routes/context";

export type Variables = {
	session: any;
	supabase: any;
	user: any;
};

const PORT = process.env.PORT || 8080;
const APPID = process.env.APPID;

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

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: createTRPCContext,
	}),
);

app.use("/api/*", (c, next) => {
	const jwtMiddleware = jwt({
		secret: process.env.JWT_SECRET ?? "",
	});
	return jwtMiddleware(c, next);
});

app.route("/game", gameRoutes); //todo change to /sandbox?
app.route("/api/arena", arenaRoutes);

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
		console.log("live-chat new: ", parsedMessage);

		WebsocketService.wsConnections.forEach(c => {
			if (!c.channels.includes(parsedMessage.channel)) return;
			c.socket.send(JSON.stringify(parsedMessage));
		});
	});
};

connectAll().then(() => {
	const instanceInfo = APPID ? `APPID: ${APPID}` : "";
	const server = serve({ fetch: app.fetch, port: Number(PORT) }, info => {
		console.log(
			`${instanceInfo} Listening on port ${info.port}  at ${info.address}: http://${info.address}:${info.port}. To access, check HAProxy config, probably http://${info.address}:8080`,
		);
	});

	WebsocketService.init(server as HTTPSServer);
});
