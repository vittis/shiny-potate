import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/http";
import { toast } from "react-toastify";
import { supabase } from "@/services/supabase/supabase";
import { queryClient } from "@/services/api/queryClient";

async function newArenaGame(playerId) {
	const { data, error } = await supabase
		.from("games")
		.insert([{ player_id: playerId }])
		.select();

	return data;
}

async function winAGame(game) {
	const { data, error } = await supabase
		.from("games")
		.update({ wins: game.wins + 1 })
		.eq("id", game.id)
		.select();

	return data;
}

const useArenaMutation = () => {
	const { mutateAsync: createNewArenaGame, isPending: arenaIsPending } = useMutation({
		mutationFn: newArenaGame,
		mutationKey: ["arena", "create"],
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["arena", "check"] });
			toast.success("Arena Started successfully");
		},
	});

	const { mutateAsync: winGame } = useMutation({
		mutationFn: winAGame,
		mutationKey: ["arena", "create"],
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["arena", "check"] });
			toast.success("Won a Game");
		},
	});

	return {
		createArenaGame: createNewArenaGame,
		win: winGame,
	};
};

export { useArenaMutation };