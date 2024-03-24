import { TRPCError } from "@trpc/server";
import { publicProcedure } from "@/services/trpc";
import { createServerSupabase } from "@/services/supabase";

export const supaProcedure = publicProcedure.use(async ({ ctx, next }) => {
	const { req } = ctx;

	const supabase = createServerSupabase(req);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			...ctx,
			user: user,
			supabase: supabase,
		},
	});
});
