import { Hono } from "hono";
import { nanoid } from "nanoid";
import {
	Game,
	Classes,
	generateItemsFromTier,
	generateRandomItems,
	EQUIPMENT_TYPE,
} from "game-logic";
import { Variables } from "../../server";

const app = new Hono<{ Variables: Variables }>();

app.post("/setup-teams", async c => {
	const { team1, team2 } = await c.req.json();

	try {
		const game = new Game({ skipConstructor: true });

		game.setTeam(0, team1);
		game.setTeam(1, team2);

		const { totalSteps, eventHistory, firstStep, effectHistory } = game.startGame();

		return c.json({
			firstStep,
			totalSteps,
			eventHistory,
			effectHistory,
		});
	} catch (e: TypeError | any) {
		console.log(e);
		return c.json({ error: e?.message }, 500);
	}
});

app.get("/setup-teams-vanilla", async c => {
	const game = new Game();

	const { totalSteps, eventHistory, firstStep, effectHistory } = game.startGame();

	return c.json({
		firstStep,
		totalSteps,
		eventHistory,
		effectHistory,
	});
});

app.get("/roll-shop/:tier", async c => {
	const tier = parseInt(c.req.param("tier") || "0");
	if (isNaN(tier) || tier < -1 || tier > 6) {
		return c.json({ error: "Invalid tier" }, 400);
	}

	const classes: string[] = [];
	Object.keys(Classes).forEach(key => {
		classes.push(key);
	});

	try {
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

		return c.json(data);
	} catch (e: TypeError | any) {
		console.log(e);
		return c.json({ error: e?.message }, 500);
	}
});

export default app;
