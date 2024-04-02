import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/supabase";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export function createServerSupabase(req: Request) {
	const authHeader = req.headers.get("Authorization");
	const accessToken = authHeader?.split(" ")?.[1];

	const globalConfig = accessToken
		? {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		: {};

	return createClient<Database>(supabaseUrl, supabaseAnonKey, {
		db: {
			schema: "public",
		},
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
		global: globalConfig,
	});
}
