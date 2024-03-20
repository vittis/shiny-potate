import { Hono } from "hono";
import { Variables } from "../../index";
import { supabase } from "../../supabase";
import { jwt } from "hono/jwt";
import { parseBody } from "hono/utils/body";

const app = new Hono<{ Variables: Variables }>();

app.get("/find-game", async c => {
	const playerId = c.get("jwtPayload");
	const { data: games, error } = await supabase
		.from("games")
		.select("*")
		.eq("player_id", playerId.sub);

	if (error) {
		return c.json({ message: error }, 500);
	}
	return c.json(games);
});

app.post("/start", async c => {
	const playerId = c.get("jwtPayload");
	const body = await c.req.json();

	const { data: team, error } = await supabase
		.from("teams")
		.insert([
			{
				player_id: playerId.sub,
				board: body.board,
				round: body.round,
				wins: body.wins,
				losses: body.losses,
			},
		])
		.select();

	if (error) {
		return c.json({ message: error }, 500);
	}

	const { data: foundMatch } = await supabase
		.from("teams")
		.select("*")
		.eq("wins", body.wins)
		.eq("round", body.round)
		.eq("losses", body.losses);

	let randomSort = 0;
	if (foundMatch) {
		randomSort = Math.floor(Math.random() * foundMatch?.length);
		console.log(randomSort);
		return c.json(foundMatch[randomSort]);
	}
});

export default app;
