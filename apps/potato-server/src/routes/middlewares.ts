import { TRPCError } from "@trpc/server";
import { publicProcedure } from "@/services/trpc";
import { createServerSupabase } from "@/services/supabase";

export const supaProcedure = publicProcedure.use(async ({ ctx, next }) => {
	const supabase = createServerSupabase();

	return next({
		ctx: {
			...ctx,
			supabase: supabase,
		},
	});
});

export const authProcedure = supaProcedure.use(async ({ ctx, next }) => {
	const { supabase, req } = ctx;

	const authHeader = req.headers.get("Authorization");
	const accessToken = authHeader?.split(" ")?.[1];
	if (!accessToken) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	const {
		data: { user },
	} = await supabase.auth.getUser(accessToken);

	if (!user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			...ctx,
			user: user,
		},
	});
});
