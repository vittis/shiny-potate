import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export function createServerSupabase(c: Context) {
	const accessToken = c.req.header("Authorization")?.split(" ")?.[1];
	if (!accessToken) {
		throw new Error("No access token provided");
	}
	return createClient(supabaseUrl, supabaseAnonKey, {
		db: {
			schema: "public",
		},
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
		global: {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	});
}
