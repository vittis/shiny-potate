import { router } from "../../services/trpc";
import { authProcedure } from "../middlewares";

export const profileRouter = router({
	gamesHistory: authProcedure.query(async ({ ctx }) => {
		const { supabase, user } = ctx;

		const { data, error } = await supabase
			.from("games_history")
			.select("*")
			.eq("player_id", user.id)
			.order("created_at", { ascending: false });

		if (error) {
			throw error;
		}

		return data;
	}),
});
