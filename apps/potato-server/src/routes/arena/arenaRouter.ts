import { router } from "../../services/trpc";
import { authProcedure } from "../middlewares";
import { generateShop } from "game-logic";

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

		const shop = generateShop(1);

		const { data, error } = await supabase
			.from("arena")
			.insert([{ player_id: user.id, shop }])
			.select();

		if (error) {
			throw error;
		}

		return data;
	}),
	abandon: authProcedure.mutation(async ({ ctx }) => {
		const { supabase, user } = ctx;

		const { error } = await supabase.from("arena").delete().eq("player_id", user.id);

		if (error) {
			throw error;
		}

		return true;
	}),
});
