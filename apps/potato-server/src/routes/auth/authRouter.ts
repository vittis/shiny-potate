import { z } from "zod";
import { supaProcedure } from "@/routes/middlewares";
import { router } from "@/services/trpc";

export const authRouter = router({
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
});
