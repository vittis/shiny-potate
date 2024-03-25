import { z } from "zod";
import { supaProcedure } from "@/routes/middlewares";
import { router } from "@/services/trpc";
import { arenaRouter } from "./arena/arenaRouter";
import { authRouter } from "./auth/authRouter";
import { sandboxRouter } from "./sandbox/sandboxRouter";

export const appRouter = router({
	hello: supaProcedure.input(z.string().nullish()).query(({ input, ctx }) => {
		console.log("pu", ctx.user?.action_link);
		return { path: ctx.req.url };
	}),
	auth: authRouter,
	arena: arenaRouter,
	sandbox: sandboxRouter,
});

export type AppRouter = typeof appRouter;
