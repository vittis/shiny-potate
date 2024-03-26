import { Hono } from "hono";
import { Variables } from "../../server";
import { createServerSupabase } from "../../services/supabase";

const app = new Hono<{ Variables: Variables }>();

app.use("*", async (c, next) => {
	const supabase = createServerSupabase(c.req as any);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	c.set("supabase", supabase);
	c.set("user", user);
	await next();
});

app.post("/new", async c => {
	try {
		const supabase = c.get("supabase");
		const user = c.get("user");

		console.log(user);

		const { data, error } = await supabase
			.from("arena")
			.insert([{ player_id: user.id }])
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
