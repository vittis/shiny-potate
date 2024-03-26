import { router } from "../../services/trpc";
import { authProcedure } from "../middlewares";

export const arenaRouter = router({
	my: authProcedure.query(async ({ ctx }) => {
		const { supabase, user } = ctx;

		const { data, error } = await supabase.from("arena").select("*").eq("player_id", user.id);

		if (error) {
			throw error;
		}

		return data;
	}),
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
});
