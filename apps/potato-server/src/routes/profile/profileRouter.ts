import { Database, Tables } from "../../../types/supabase";
import { router } from "../../services/trpc";
import { authProcedure } from "../middlewares";

export const profileRouter = router({
	gamesHistory: authProcedure.query(async ({ ctx }) => {
		const { supabase, user } = ctx;

		const { data, error } = await supabase
			.from("games_history")
			.select(
				`
				*,
				my_board:board!board_id(*),
				opponent_board:board!opponent_board_id(*),
				my_profile:profiles!player_id(
					username
				),
				opponent_profile:profiles!opponent_id(
					username
				),
				winner:profiles!winner_id(
					username
				)
			`,
			)
			.eq("player_id", user.id)
			.order("created_at", { ascending: false });

		if (error) {
			throw error;
		}

		return data;
	}),
});
