import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/services/supabase/supabase";

async function checkUsername(playerId) {
	console.log(playerId);
	const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", playerId);

	if (profile?.[0].username) {
		return true;
	} else {
		return false;
	}
}

const useProfileQueries = (): any => {
	const user = useSupabaseUserStore(state => state.user);

	const { data: hasUsername } = useQuery({
		queryKey: ["profile", "check"],
		queryFn: () => checkUsername(user.id),
		enabled: !!user,
	});
	/* 
	const hasGame = arenaData && arenaData?.length > 0;
	const game = hasGame && arenaData[0]; */
	return { hasUsername };
};

export { useProfileQueries };
