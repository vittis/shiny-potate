import { authProcedure } from "@/routes/middlewares";
import { router } from "@/services/trpc";

export const arenaRouter = router({
	new: authProcedure.mutation(async ({ ctx }) => {
		const { supabase, user } = ctx;

		const { data, error } = await supabase
			.from("arena")
			.insert([{ player_id: user.id }])
			.select();

		if (error) {
			throw error;
		}

		return data;
	}),
	me: authProcedure.query(async ({ ctx }) => {
		const { supabase, user } = ctx;

		const { data, error } = await supabase.from("arena").select("*").eq("player_id", user.id);

		if (error) {
			throw error;
		}

		return data;
	}),
});
