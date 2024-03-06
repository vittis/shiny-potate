import { Hono } from "hono";
import { Variables } from "../../index";
import { Game, Weapons, Classes } from "game-logic";
import { nanoid } from "nanoid";

const app = new Hono<{ Variables: Variables }>();

app.post("/setup-teams", async c => {
	const { team1, team2 } = await c.req.json();
	const game = new Game({ skipConstructor: true });

	game.setTeam(0, team1);
	game.setTeam(1, team2);

	const { totalSteps, eventHistory, firstStep } = game.startGame();

	return c.json({
		firstStep,
		totalSteps,
		eventHistory,
	});
});

app.get("/all-stuff", async c => {
	const classes: string[] = [];
	Object.keys(Classes).forEach(key => {
		classes.push(key);
	});
	const weapons: string[] = [];
	Object.keys(Weapons).forEach(key => {
		weapons.push(key);
	});

	const data = {
		classes: classes.map(c => ({ id: nanoid(4), name: c })),
		weapons: weapons.map(w => ({ id: nanoid(4), name: w })),
	};

	return c.json(data);
});

export default app;
