import { z } from "zod";
import { arenaRouter } from "./arena/arenaRouter";
import { publicProcedure, router } from "../services/trpc";

export const appRouter = router({
	hello: publicProcedure.input(z.string().nullish()).query(({ input, ctx }) => {
		console.log(ctx.bagulho);
		return `Hello ${input ?? "World"}!`;
	}),
	arena: arenaRouter,
});

export type AppRouter = typeof appRouter;
