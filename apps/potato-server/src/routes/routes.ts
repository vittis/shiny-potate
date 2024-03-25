import { z } from "zod";
import { supaProcedure } from "@/routes/middlewares";
import { router } from "@/services/trpc";
import { arenaRouter } from "./arena/arenaRouter";

export const appRouter = router({
	hello: supaProcedure.input(z.string().nullish()).query(({ input, ctx }) => {
		console.log("pu", ctx.user?.action_link);
		return { path: ctx.req.url };
	}),
	login: supaProcedure
		.input(
			z.object({
				email: z.string(),
				password: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { email, password } = input;
			const { supabase } = ctx;

			const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});

			if (error) {
				throw error;
			}

			return { data };
		}),
	arena: arenaRouter,
});

export type AppRouter = typeof appRouter;
