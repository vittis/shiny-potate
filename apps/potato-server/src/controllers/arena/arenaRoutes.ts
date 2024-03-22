import { Hono } from "hono";
import { Variables } from "../../index";
import { createServerSupabase } from "../../supabase";

const app = new Hono<{ Variables: Variables }>();

app.post("/new-run", async c => {
	try {
		const supabase = createServerSupabase(c);

		const payload = c.get("jwtPayload");

		const userId = payload?.sub;
		const { data, error } = await supabase
			.from("arena")
			.insert([{ player_id: userId }])
			.select();

		if (error) {
			throw error;
		}

		return c.json(data);
	} catch (e: TypeError | any) {
		console.log(e);
		return c.json({ error: e?.message }, 500);
	}
});

export default app;
