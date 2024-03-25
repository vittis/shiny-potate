import { authProcedure, supaProcedure } from "@/routes/middlewares";
import { router } from "@/services/trpc";

export const arenaRouter = router({
	new: authProcedure.query(async ({ ctx }) => {
		const { supabase, user } = ctx;
		console.log(user);

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

		console.log(user.id);

		const { data, error } = await supabase
			.from("arena")
			.select("*")
			.eq("player_id", "a22ca091-943c-4151-9398-2730fc37c2be");

		if (error) {
			throw error;
		}

		return data;
	}),
});
