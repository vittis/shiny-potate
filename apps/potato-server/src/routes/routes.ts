import { z } from "zod";
import { arenaRouter } from "./arena/arenaRouter";
import { authRouter } from "./auth/authRouter";
import { sandboxRouter } from "./sandbox/sandboxRouter";
import { supaProcedure } from "./middlewares";
import { router } from "../services/trpc";
import { profileRouter } from "./profile/profileRouter";

export const appRouter = router({
	hello: supaProcedure.input(z.string().nullish()).query(({ input, ctx }) => {
		return "oi";
	}),
	auth: authRouter,
	arena: arenaRouter,
	sandbox: sandboxRouter,
	profile: profileRouter,
});

export type AppRouter = typeof appRouter;
