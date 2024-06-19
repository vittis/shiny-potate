import { z } from "zod";
import {
	Classes,
	EQUIPMENT_TYPE,
	Game,
	generateItemsFromTier,
	generateRandomItems,
} from "game-logic";
import { nanoid } from "nanoid";
import { publicProcedure, router } from "../../services/trpc";

export const sandboxRouter = router({
	setupTeams: publicProcedure
		.input(
			z.object({
				team1: z.array(
					z.object({
						equipments: z.array(z.any()),
						position: z.number(),
						unitClass: z.string(),
					}),
				),
				team2: z.array(
					z.object({
						equipments: z.array(z.any()),
						position: z.number(),
						unitClass: z.string(),
					}),
				),
			}),
		)
		.mutation(async ({ input }) => {
			const { team1, team2 } = input;
			const game = new Game({ skipConstructor: true });

			game.setTeam(0, team1);
			game.setTeam(1, team2);

			const { totalSteps, eventHistory, firstStep, effectHistory, winner } = game.startGame();

			return {
				firstStep,
				totalSteps,
				eventHistory,
				effectHistory,
				winner,
			};
		}),
	rollShop: publicProcedure
		.input(
			z
				.object({
					tier: z.number(),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			// console.log(`input=${encodeURIComponent(JSON.stringify({ tier: 1 }))}`);
			const tier = input?.tier ?? 0;
			if (tier < -1 || tier > 6) {
				throw new Error("Invalid tier");
			}

			const classes: string[] = [];
			Object.keys(Classes).forEach(key => {
				classes.push(key);
			});

			const weapons =
				tier === -1
					? generateRandomItems({ quantityPerItem: 3 }, EQUIPMENT_TYPE.WEAPON)
					: generateItemsFromTier(tier, { quantityPerItem: 1 }, EQUIPMENT_TYPE.WEAPON);

			const trinkets =
				tier === -1
					? generateRandomItems({ quantityPerItem: 3 }, EQUIPMENT_TYPE.TRINKET)
					: generateItemsFromTier(tier, { quantityPerItem: 1 }, EQUIPMENT_TYPE.TRINKET);

			const data = {
				classes: classes.map(c => ({ id: nanoid(4), name: c })),
				weapons: weapons,
				trinkets: trinkets,
			};

			return data;
		}),
});
