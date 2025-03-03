import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/services/supabase/supabase";
import { useEffect } from "react";

async function fetchUsername(playerId) {
	const { data } = await supabase.from("profiles").select("*").eq("id", playerId);

	return data;
}

const useProfileQueries = () => {
	const user = useSupabaseUserStore(state => state.user);
	const setUsername = useSupabaseUserStore(state => state.setUsername);
	const setUserIsPending = useSupabaseUserStore(state => state.setUserIsPending);

	const { data, isSuccess } = useQuery({
		queryKey: ["profile", "check"],
		queryFn: () => fetchUsername(user.id),
		enabled: !!user,
	});

	useEffect(() => {
		if (isSuccess && data?.[0]?.username) {
			setUsername(data?.[0]?.username);
			setUserIsPending(false);
		}
	}, [data, isSuccess]);
};

export { useProfileQueries };
