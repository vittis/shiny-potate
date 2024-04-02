import { z } from "zod";
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

		return data as unknown as { aaa: number };
	}),
	save: authProcedure
		/* 		.input(
			z.object({
				arena: z.any(),
			}),
		) needs to recevie the arena*/
		.mutation(async ({ ctx, input }) => {
			const { supabase, user } = ctx;

			const { data, error } = await supabase
				.from("arena")
				.update({ wins: 1 }) // needs to recieve the arena object todo
				.eq("player_id", user.id)
				.select();

			if (error) {
				throw error;
			}

			return { data };
		}),
	matchmaking: authProcedure.mutation(async ({ ctx }) => {
		const { supabase, user } = ctx;

		const { data: myArena, error } = await supabase
			.from("arena")
			.select("*")
			.eq("player_id", user.id);

		if (error) {
			throw error;
		}

		const { data: team, error: teamError } = await supabase
			.from("teams")
			.insert([
				{
					player_id: myArena[0].player_id,
					board: [],
					round: myArena[0].round,
					wins: myArena[0].wins,
					losses: myArena[0].losses,
				},
			])
			.select();

		if (teamError) {
			throw teamError;
		}

		if (!myArena?.[0]) {
			throw "invalid game";
		}
		const { data: foundMatch } = await supabase
			.from("teams")
			.select("*")
			.eq("wins", myArena[0].wins as number)
			.eq("round", myArena[0].round as number)
			.eq("losses", myArena[0].losses as number);

		let randomSort = 0;
		if (foundMatch) {
			randomSort = Math.floor(Math.random() * foundMatch?.length);
			return foundMatch[randomSort];
		}
	}),
});
