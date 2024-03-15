import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/services/supabase/supabase";
import { useEffect } from "react";

async function fetchUsername(playerId) {
	const { data: profile } = await supabase.from("profiles").select("*").eq("id", playerId);

	return profile?.[0]?.username;
}

const useProfileQueries = () => {
	const user = useSupabaseUserStore(state => state.user);
	const setUsername = useSupabaseUserStore(state => state.setUsername);

	const { data: username } = useQuery({
		queryKey: ["profile", "check"],
		queryFn: () => fetchUsername(user.id),
		enabled: !!user,
	});

	useEffect(() => {
		if (username) {
			console.log({ username });
			setUsername(username);
		}
	}, [username]);

	console.log({ username });
};

export { useProfileQueries };
