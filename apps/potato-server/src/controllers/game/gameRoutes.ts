import { Hono } from "hono";
import { Variables } from "../../index";
import { Game, Classes, generateWeaponsFromTier, generateRandomWeapons } from "game-logic";
import { nanoid } from "nanoid";

const app = new Hono<{ Variables: Variables }>();

app.post("/setup-teams", async c => {
	const { team1, team2 } = await c.req.json();

	try {
		const game = new Game({ skipConstructor: true });

		game.setTeam(0, team1);
		game.setTeam(1, team2);

		const { totalSteps, eventHistory, firstStep } = game.startGame();

		return c.json({
			firstStep,
			totalSteps,
			eventHistory,
		});
	} catch (e: TypeError | any) {
		console.log(e);
		return c.json({ error: e?.message }, 500);
	}
});

app.get("/setup-teams-vanilla", async c => {
	const game = new Game();

	const { totalSteps, eventHistory, firstStep } = game.startGame();

	return c.json({
		firstStep,
		totalSteps,
		eventHistory,
	});
});

app.get("/roll-shop/:tier", async c => {
	const tier = parseInt(c.req.param("tier") || "0");

	const classes: string[] = [];
	Object.keys(Classes).forEach(key => {
		classes.push(key);
	});

	try {
		let weapons = [];
		if (tier === -1) {
			weapons = generateRandomWeapons({ quantityPerWeapon: 3 });
		} else {
			weapons = generateWeaponsFromTier(tier, { quantityPerWeapon: 1 });
		}

		const data = {
			classes: classes.map(c => ({ id: nanoid(4), name: c })),
			weapons: weapons.map(w => ({ id: nanoid(4), data: w })),
		};

		return c.json(data);
	} catch (e: TypeError | any) {
		console.log(e);
		return c.json({ error: e?.message }, 500);
	}
});

export default app;
