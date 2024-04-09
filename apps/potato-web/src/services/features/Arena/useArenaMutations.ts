import { queryClient } from "@/services/api/queryClient";
import { trpc } from "@/services/api/trpc";
import { toast } from "react-toastify";

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

	const { mutateAsync: updateBoard, isPending: updateBoardIsPending } =
		trpc.arena.updateBoard.useMutation({
			onSuccess: () => {
				// queryClient.invalidateQueries({ queryKey: ["arena", "my"] });
			},
			onError: error => {
				queryClient.invalidateQueries({ queryKey: ["arena", "my"] });
			},
		});

	const { mutateAsync: findAndBattleOpponent, isPending: findAndBattleOpponentIsPending } =
		trpc.arena.findAndBattleOpponent.useMutation({
			onSuccess: data => {
				console.log(data);
				toast.success("Opponent found");
			},
		});

	// todo group?
	return {
		newRun,
		newRunIsPending,
		abandonRun,
		abandonRunIsPending,
		updateBoard,
		updateBoardIsPending,
		findAndBattleOpponent,
		findAndBattleOpponentIsPending,
	};
};

export { useArenaMutations };
