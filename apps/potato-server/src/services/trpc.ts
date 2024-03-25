import { initTRPC } from "@trpc/server";
import { SupabaseClient, User } from "@supabase/supabase-js";

interface TRPCContext {
	user?: User;
	req: Request;
	supabase?: SupabaseClient;
}

export const createTRPCContext = async (opts: {
	req: Request;
	resHeaders: any;
}): Promise<TRPCContext> => {
	return {
		req: opts.req,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const publicProcedure = t.procedure;
export const router = t.router;
