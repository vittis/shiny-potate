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

export const arenaRouter = router({
	my: authProcedure.query(async ({ ctx }) => {
		const { supabase, user } = ctx;

		const { data, error } = await supabase
			.from("arena")
			.select("*")
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

			if (!currentShop || !currentGold || !currentBoard || !currentStorage) {
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

		// todo fix null checks
		if (myRunError || !myRun || !myRun?.round || !myRun?.board || !myRun?.gold) {
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
		// @ts-expect-error fix auto-generated
		game.setBoard(1, finalOpponentBoard.board);
		const { totalSteps, eventHistory, firstStep, effectHistory } = game.startGame();

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

		const { error: insertGamesHistoryError } = await supabase.from("games_history").insert([
			{
				player_id: user.id,
				board_id: boardData.id,
				opponent_board_id: finalOpponentBoard.id,
				winner_id: user.id, // todo get from Game
			},
		]);

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
				// todo wins and losses
			})
			.eq("player_id", user.id);

		if (updateError) {
			console.trace(updateError);
			throw updateError;
		}

		return { totalSteps, eventHistory, firstStep, effectHistory };
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
				.select("*")
				.eq("id", gameId)
				.maybeSingle();

			if (error || !data) {
				console.trace(error || "No game found");
				throw error || new Error("No game found");
			}

			console.log(data.id);
			const { data: board1Data } = await supabase
				.from("board")
				.select("*")
				.eq("id", data.board_id)
				.maybeSingle();

			const { data: board2Data } = await supabase
				.from("board")
				.select("*")
				.eq("id", data.opponent_board_id)
				.maybeSingle();

			if (!board1Data || !board2Data) {
				console.trace("No board found");
				throw new Error("No board found");
			}

			const board1 = board1Data.board as Board;
			const board2 = board2Data.board as Board;

			const game = new Game({ skipConstructor: true });
			game.setBoard(0, board1);
			game.setBoard(1, board2);

			const gameShit = game.startGame();

			return gameShit;
		}),
});
