import { queryClient } from "@/services/api/queryClient";
import { Board, Storage } from "game-logic";
import { useArenaMutations } from "./useArenaMutations";
import { useEffect, useRef } from "react";
import { useArenaQueries } from "./useArenaQueries";
import { useMutationState } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { trpc } from "@/services/api/trpc";

export function setBoard(newBoard: Board) {
	queryClient.setQueryData(["arena", "my"], (oldData: any) => {
		return {
			...oldData,
			board: newBoard,
			updated_at: new Date().toISOString(),
			hasChange: true,
		};
	});
}

export function setStorage(newStorage: Storage) {
	queryClient.setQueryData(["arena", "my"], (oldData: any) => {
		return {
			...oldData,
			storage: newStorage,
			updated_at: new Date().toISOString(),
			hasChange: true,
		};
	});
}

// only one instance of this hook should be used globally
const useArenaUpdate = () => {
	const { updateBoard } = useArenaMutations();
	const { currentRun: data, board, storage } = useArenaQueries();
	const updateTimeoutRef = useRef<any>(null);

	useEffect(() => {
		// @ts-expect-error this is a client-only field that we use to track changes
		const hasChange = data?.hasChange;

		async function triggerUpdate() {
			if (!data || !board || !storage) return;

			if (hasChange) {
				const updatedData = await updateBoard.mutateAsync({ board, storage });
				queryClient.setQueryData(["arena", "my"], (oldData: typeof data) => updatedData);
			}
		}

		if (hasChange) {
			if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
			updateTimeoutRef.current = setTimeout(() => {
				triggerUpdate();
			}, 3000);
		}

		return () => {
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}
		};
	}, [data, board, storage, updateBoard]);

	return null;
};

const useArenaIsUpdating = () => {
	const status = useMutationState({
		filters: { mutationKey: getQueryKey(trpc.arena.updateBoard) },
		select: mutation => mutation.state.status,
	});

	return status.some(s => s === "pending");
};

export { useArenaUpdate, useArenaIsUpdating };
