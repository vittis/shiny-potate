import { queryClient } from "@/services/api/queryClient";
import { trpc, vanillaTrpc } from "@/services/api/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

async function updateBoardFn(payload) {
	const data = await vanillaTrpc.arena.updateBoard.mutate(payload);
	return data;
}

const useArenaMutations = () => {
	const { mutateAsync: newRun, isPending: newRunIsPending } = trpc.arena.new.useMutation({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["arena", "my"] });
		},
	});

	const { mutateAsync: abandonRun, isPending: abandonRunIsPending } =
		trpc.arena.abandon.useMutation({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["arena", "my"] });
			},
		});

	/* const updateBoard = useMutation({
		mutationKey: ["arena", "updateBoard"],
		mutationFn: updateBoardFn,
		onSuccess: data => {
			updateBoard.reset();
		},
	});
	console.log({ status: updateBoard.status }); */

	const updateBoard = trpc.arena.updateBoard.useMutation({
		onError: error => {
			queryClient.invalidateQueries({ queryKey: ["arena", "my"] });
		},
	});

	const { mutateAsync: findAndBattleOpponent, isPending: findAndBattleOpponentIsPending } =
		trpc.arena.findAndBattleOpponent.useMutation({
			onSuccess: data => {
				toast.success("Opponent found!");
				queryClient.invalidateQueries({ queryKey: ["arena", "my"] });
			},
		});

	const { mutateAsync: saveRoundSnapshot, isPending: saveRoundSnapshotIsPending } =
		trpc.dev.saveRoundSnapshot.useMutation({
			onSuccess: data => {
				toast.success("Round saved!");
				queryClient.invalidateQueries({ queryKey: ["arena", "my"] });
			},
		});

	const clearAllData = trpc.dev.clearAllData.useMutation({
		onSuccess: data => {
			toast.success("Cleared all data!");
			queryClient.invalidateQueries({ queryKey: ["arena", "my"] });
			queryClient.invalidateQueries({ queryKey: ["profile", "history"] });
		},
	});

	const seedData = trpc.dev.seedData.useMutation({
		onSuccess: data => {
			toast.success("Seeded rounds!");
		},
	});

	// todo group?
	return {
		newRun,
		newRunIsPending,
		abandonRun,
		abandonRunIsPending,
		updateBoard,
		findAndBattleOpponent,
		findAndBattleOpponentIsPending,
		saveRoundSnapshot,
		saveRoundSnapshotIsPending,
		clearAllData,
		seedData,
	};
};

export { useArenaMutations };
