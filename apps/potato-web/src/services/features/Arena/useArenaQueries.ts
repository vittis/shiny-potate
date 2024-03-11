import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { api } from "../../api/http";
import { useUserStore } from "../User/useUserStore";
import { toast } from "react-toastify";
import { supabase } from "@/services/supabase/supabase";

async function checkArenaGame(playerId) {
	const { data: games, error } = await supabase
		.from("games")
		.select("player_id", playerId)
		.select();

	return games;
}

const useArenaQueries = (): any => {
	const user = useSupabaseUserStore(state => state.user);

	const { data: arenaData, isLoading: arenaIsLoading } = useQuery({
		queryKey: ["arena", "check"],
		queryFn: () => checkArenaGame(user.id),
		enabled: !!user,
	});

	const hasGame = arenaData && arenaData?.length > 0;
	const game = hasGame && arenaData[0];
	return { arenaData, arenaIsLoading, hasGame, game };
};

export { useArenaQueries };