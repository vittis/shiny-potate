import { z } from "zod";
import {
	Board,
	Game,
	Shop,
	ShopEquipInstance,
	ShopUnitInstance,
	Storage,
	generateShop,
} from "game-logic";
import { router } from "../../services/trpc";
import { authProcedure } from "../middlewares";
import { Database } from "../../types";

export const arenaRouter = router({
	my: authProcedure.query(async ({ ctx }) => {
		const { supabase, user } = ctx;

		const { data, error } = await supabase
			.from("arena")
			.select(
				`
					*,
					profiles(
						username
					)
			`,
			)
			.eq("player_id", user.id)
			.maybeSingle();

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
	new: authProcedure.mutation(async ({ ctx }) => {
		const { supabase, user } = ctx;

		try {
			const shop = generateShop(1);

			const emptyBoard = [
				{
					position: "2",
					unit: null,
				},
				{
					position: "1",
					unit: null,
				},
				{
					position: "0",
					unit: null,
				},
				{
					position: "5",
					unit: null,
				},
				{
					position: "4",
					unit: null,
				},
				{
					position: "3",
					unit: null,
				},
			];

			const { data, error } = await supabase
				.from("arena")
				.insert([
					{ player_id: user.id, board: emptyBoard, shop, storage: { units: [], equips: [] } },
				])
				.select();

			if (error) {
				console.error(error);
				throw error;
			}
			return data;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}),
	updateBoard: authProcedure
		.input(
			z.object({
				board: z.array(z.any()),
				storage: z.object({
					units: z.array(z.any()),
					equips: z.array(z.any()),
				}),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { board, storage } = input as { board: Board; storage: Storage };

			const { supabase, user } = ctx;

			const { data: yourRun, error } = await supabase
				.from("arena")
				.select("*")
				.eq("player_id", user.id)
				.maybeSingle();

			if (error || !yourRun) {
				throw error || new Error("No run found");
			}

			const currentShop = yourRun?.shop;
			const currentGold = yourRun?.gold;
			const currentBoard = yourRun?.board;
			const currentStorage = yourRun?.storage;

			if (!currentShop || currentGold === null || !currentBoard || !currentStorage) {
				throw new Error("Wrong data structure in database");
			}

			const yourUnits = [...storage.units, ...board.map(space => space.unit).filter(u => u)];
			const unitsBoughtFromShop = currentShop.units.filter(shopUnit =>
				yourUnits.find(unit => unit?.id === shopUnit.id),
			);

			const shopEquipsFromUnits = yourUnits.reduce((acc, unit) => {
				if (!unit) {
					return acc;
				}
				return [...acc, ...unit.unit.shopEquipment.map(equip => equip.shopEquip)];
			}, [] as ShopEquipInstance[]);

			const yourEquips = [...storage.equips, ...shopEquipsFromUnits];

			const allShopEquips = [...currentShop.weapons, ...currentShop.trinkets];

			const equipsBoughtFromShop = allShopEquips.filter(shopEquip =>
				yourEquips.find(equip => equip.id === shopEquip.id),
			);

			const newShop: Shop = {
				units: currentShop.units.filter(unit => !unitsBoughtFromShop.includes(unit)),
				weapons: currentShop.weapons.filter(weapon => !equipsBoughtFromShop.includes(weapon)),
				trinkets: currentShop.trinkets.filter(trinket => !equipsBoughtFromShop.includes(trinket)),
			};

			const goldSpent =
				unitsBoughtFromShop.reduce((acc, unit) => acc + unit?.price, 0) +
				equipsBoughtFromShop.reduce((acc, equip) => acc + equip.price, 0);

			if (currentGold < goldSpent) {
				throw new Error("Not enough gold.");
			}

			const { data: updatedData, error: updateError } = await supabase
				.from("arena")
				.update({
					gold: currentGold - goldSpent,
					board,
					storage,
					shop: newShop,
					updated_at: new Date().toISOString(),
				})
				.eq("player_id", user.id)
				.select()
				.maybeSingle();

			if (updateError) {
				throw updateError;
			}

			return updatedData;
		}),
	findAndBattleOpponent: authProcedure.mutation(async ({ ctx }) => {
		const { supabase, user } = ctx;

		const { data: myRun, error: myRunError } = await supabase
			.from("arena")
			.select("*")
			.eq("player_id", user.id)
			.maybeSingle();

		if (myRunError || !myRun) {
			console.trace(myRunError || "No run found");
			throw myRunError || new Error("No run found");
		}

		const { data: opponentBoard, error: opponentBoardError } = await supabase
			.from("board")
			.select("*")
			.eq("round", myRun.round)
			.neq("player_id", user.id);

		if (opponentBoardError || !opponentBoard || opponentBoard.length === 0) {
			console.trace(opponentBoardError || "No opponent found");
			throw opponentBoardError || new Error("No opponent found");
		}

		// randomize opponent board
		const finalOpponentBoard = opponentBoard[Math.floor(Math.random() * opponentBoard.length)];

		const game = new Game({ skipConstructor: true });
		game.setBoard(0, myRun.board);
		game.setBoard(1, finalOpponentBoard.board);
		const { totalSteps, eventHistory, firstStep, effectHistory, winner } = game.startGame();

		const { data: boardData, error: insertError } = await supabase
			.from("board")
			.insert([
				{
					player_id: user.id,
					round: myRun.round,
					wins: myRun.wins,
					losses: myRun.losses,
					board: myRun.board,
				},
			])
			.select("*")
			.single();

		console.log({ boardData });

		if (insertError || !boardData) {
			console.trace(insertError || "Board insert error");
			throw insertError || new Error("Board insert error");
		}

		const { data: gameHistoryData, error: insertGamesHistoryError } = await supabase
			.from("games_history")
			.insert([
				{
					player_id: user.id,
					opponent_id: finalOpponentBoard.player_id,
					board_id: boardData.id,
					opponent_board_id: finalOpponentBoard.id,
					winner_id: winner === 0 ? user.id : finalOpponentBoard.player_id,
				},
			])
			.select("id")
			.single();

		if (insertGamesHistoryError) {
			console.trace(insertGamesHistoryError);
			throw insertGamesHistoryError;
		}

		const { error: updateError } = await supabase
			.from("arena")
			.update({
				round: myRun?.round + 1,
				gold: myRun?.gold + 10,
				updated_at: new Date().toISOString(),
				shop: generateShop(myRun?.round + 1),
				wins: winner === 0 ? myRun?.wins + 1 : myRun?.wins,
				losses: winner === 1 ? myRun?.losses + 1 : myRun?.losses,
			})
			.eq("player_id", user.id);

		if (updateError) {
			console.trace(updateError);
			throw updateError;
		}

		return {
			gameId: gameHistoryData.id,
			game: { totalSteps, eventHistory, firstStep, effectHistory },
		};
	}),
	viewBattle: authProcedure
		.input(
			z.object({
				gameId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { gameId } = input;
			const { supabase } = ctx;

			const { data, error } = await supabase
				.from("games_history")
				.select(
					`
					*,
					my_board:board!board_id("*"),
					opponent_board:board!opponent_board_id("*"),
					my_profile:profiles!player_id(
						username
					),
					opponent_profile:profiles!opponent_id(
						username
					)
				`,
				)
				.eq("id", gameId)
				.maybeSingle();

			if (error || !data) {
				console.trace(error || "No game found");
				throw error || new Error("No game found");
			}

			// todo move somwhere else
			type Profile = Database["public"]["Tables"]["profiles"]["Row"];
			type DbBoard = Database["public"]["Tables"]["board"]["Row"];

			const myProfile = data.my_profile as unknown as Profile;
			const opponentProfile = data.opponent_profile as unknown as Profile;

			const myBoard = data.my_board as unknown as DbBoard;
			const opponentBoard = data.opponent_board as unknown as DbBoard;

			const myInfo = {
				username: myProfile.username,
				round: myBoard.round,
				wins: myBoard.wins,
				losses: myBoard.losses,
				createdAt: myBoard.created_at,
			};

			const opponentInfo = {
				username: opponentProfile.username,
				round: opponentBoard.round,
				wins: opponentBoard.wins,
				losses: opponentBoard.losses,
				createdAt: opponentBoard.created_at,
			};

			const game = new Game({ skipConstructor: true });
			game.setBoard(0, myBoard.board);
			game.setBoard(1, opponentBoard.board);

			const gameShit = game.startGame();

			return { game: gameShit, myInfo, opponentInfo };
		}),
});
