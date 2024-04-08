import { z } from "zod";
import {
	Board,
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
				throw error;
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

			const { data: updatedData, error: updateError } = await supabase
				.from("arena")
				.update({
					gold: currentGold - goldSpent,
					board,
					storage,
					shop: newShop,
				})
				.eq("player_id", user.id)
				.select()
				.maybeSingle();

			if (updateError) {
				throw updateError;
			}

			return updatedData;
		}),
});
