import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export function createServerSupabase(req: Request) {
	const authHeader = req.headers.get("Authorization");
	const accessToken = authHeader?.split(" ")?.[1];
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
