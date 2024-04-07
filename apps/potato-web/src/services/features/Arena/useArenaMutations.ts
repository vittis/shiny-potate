import { queryClient } from "@/services/api/queryClient";
import { trpc } from "@/services/api/trpc";

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
	return { newRun, newRunIsPending, abandonRun, abandonRunIsPending };
};

export { useArenaMutations };
