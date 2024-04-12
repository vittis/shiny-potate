import { z } from "zod";
import { router } from "../../services/trpc";
import { authProcedure } from "../middlewares";
import { Board, generateShop } from "game-logic";
import {
	EXISTING_PLAYER_ID,
	ROUND_1_BOARD,
	ROUND_2_BOARD,
	ROUND_3_BOARD,
	ROUND_4_BOARD,
	ROUND_5_BOARD,
} from "./seedData";

export const devRouter = router({
	saveRoundSnapshot: authProcedure
		.input(z.object({ countAsWin: z.boolean().optional() }))
		.mutation(async ({ ctx, input }) => {
			const { supabase, user } = ctx;
			const { countAsWin } = input;

			const { data: myRun, error: myRunError } = await supabase
				.from("arena")
				.select("*")
				.eq("player_id", user.id)
				.maybeSingle();

			if (myRunError || !myRun) {
				console.trace(myRunError || "No run found");
				throw myRunError || new Error("No run found");
			}

			const { data: boardData, error: insertError } = await supabase
				.from("board")
				.insert([
					{
						player_id: user.id,
						round: myRun.round,
						wins: countAsWin ? myRun?.wins + 1 : myRun.wins,
						losses: !countAsWin ? myRun?.losses + 1 : myRun.losses,
						board: myRun.board,
					},
				])
				.select("*")
				.single();

			if (insertError || !boardData) {
				console.trace(insertError || "Board insert error");
				throw insertError || new Error("Board insert error");
			}

			const { error: updateError } = await supabase
				.from("arena")
				.update({
					round: myRun?.round + 1,
					gold: myRun?.gold + 10,
					updated_at: new Date().toISOString(),
					shop: generateShop(myRun?.round + 1),
					wins: countAsWin ? myRun?.wins + 1 : myRun.wins,
					losses: !countAsWin ? myRun?.losses + 1 : myRun.losses,
				})
				.eq("player_id", user.id);

			if (updateError) {
				console.trace(updateError);
				throw updateError;
			}

			return { ok: true };
		}),
	clearAllData: authProcedure.mutation(async ({ ctx }) => {
		const { supabase } = ctx;

		const { error: arenaError } = await supabase
			.from("arena")
			.delete()
			.neq("player_id", "111afeae-c419-4697-9706-b423608a1dbc");
		const { error: gameHistoryError } = await supabase
			.from("games_history")
			.delete()
			.neq("player_id", "111afeae-c419-4697-9706-b423608a1dbc");
		const { error: boardError } = await supabase
			.from("board")
			.delete()
			.neq("player_id", "111afeae-c419-4697-9706-b423608a1dbc");

		if (arenaError || boardError || gameHistoryError) {
			console.trace(arenaError || boardError || gameHistoryError);
			throw arenaError || boardError || gameHistoryError;
		}

		return { ok: true };
	}),
	seedData: authProcedure.mutation(async ({ ctx }) => {
		const { supabase } = ctx;

		const { error: insertError } = await supabase.from("board").insert([
			{
				player_id: EXISTING_PLAYER_ID,
				round: 1,
				wins: 0,
				losses: 0,
				board: ROUND_1_BOARD as Board,
			},
			{
				player_id: EXISTING_PLAYER_ID,
				round: 2,
				wins: 1,
				losses: 0,
				board: ROUND_2_BOARD as Board,
			},
			{
				player_id: EXISTING_PLAYER_ID,
				round: 3,
				wins: 2,
				losses: 0,
				board: ROUND_3_BOARD as Board,
			},
			{
				player_id: EXISTING_PLAYER_ID,
				round: 4,
				wins: 3,
				losses: 0,
				board: ROUND_4_BOARD as Board,
			},
			{
				player_id: EXISTING_PLAYER_ID,
				round: 5,
				wins: 3,
				losses: 1,
				board: ROUND_5_BOARD as Board,
			},
		]);

		if (insertError) {
			console.trace(insertError);
			throw insertError;
		}

		return { ok: true };
	}),
});
