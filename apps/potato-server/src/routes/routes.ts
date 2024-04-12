import { arenaRouter } from "./arena/arenaRouter";
import { authRouter } from "./auth/authRouter";
import { sandboxRouter } from "./sandbox/sandboxRouter";
import { router } from "../services/trpc";
import { profileRouter } from "./profile/profileRouter";
import { devRouter } from "./dev/devRouter";

export const appRouter = router({
	auth: authRouter,
	arena: arenaRouter,
	sandbox: sandboxRouter,
	profile: profileRouter,
	dev: devRouter,
});

export type AppRouter = typeof appRouter;
