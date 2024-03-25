import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export function createServerSupabase() {
	return createClient(supabaseUrl, supabaseAnonKey, {
		db: {
			schema: "public",
		},
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
		/* global: {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}, */
	});
}
