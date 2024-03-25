import { z } from "zod";
import { publicProcedure, router } from "@/services/trpc";
import {
	Classes,
	EQUIPMENT_TYPE,
	Game,
	generateItemsFromTier,
	generateRandomItems,
} from "game-logic";
import { nanoid } from "nanoid";

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

			game.setTeam(0, team1 as any);
			game.setTeam(1, team2 as any);

			const { totalSteps, eventHistory, firstStep } = game.startGame();

			return {
				firstStep,
				totalSteps,
				eventHistory,
			};
		}),
	rollShop: publicProcedure
		.input(
			z.object({
				tier: z.number(),
			}),
		)
		.query(async ({ input }) => {
			// console.log(`input=${encodeURIComponent(JSON.stringify({ tier: 1 }))}`);
			const tier = input.tier || 0;
			if (tier < -1 || tier > 6) {
				throw new Error("Invalid tier");
			}

			const classes: string[] = [];
			Object.keys(Classes).forEach(key => {
				classes.push(key);
			});

			let weapons = [];
			if (tier === -1) {
				weapons = generateRandomItems({ quantityPerItem: 3 }, EQUIPMENT_TYPE.WEAPON);
			} else {
				weapons = generateItemsFromTier(tier, { quantityPerItem: 1 }, EQUIPMENT_TYPE.WEAPON);
			}

			let trinkets = [];
			if (tier === -1) {
				trinkets = generateRandomItems({ quantityPerItem: 3 }, EQUIPMENT_TYPE.TRINKET);
			} else {
				trinkets = generateItemsFromTier(tier, { quantityPerItem: 1 }, EQUIPMENT_TYPE.TRINKET);
			}

			const data = {
				classes: classes.map(c => ({ id: nanoid(4), name: c })),
				weapons: weapons.map(w => ({ id: nanoid(4), data: w })),
				trinkets: trinkets.map(t => ({ id: nanoid(4), data: t })),
			};

			return data;
		}),
});