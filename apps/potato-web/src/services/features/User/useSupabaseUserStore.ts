import { create } from "zustand";

interface SupabaseUserState {
	user?: any;
	username?: string;
	setUser: (user: any) => void;
	removeUser: () => void;
	setUsername: (username: string) => void;
	userIsPending: boolean;
	setUserIsPending: (isPending: boolean) => void;
}

const useSupabaseUserStore = create<SupabaseUserState>()(set => ({
	user: undefined,
	username: undefined,
	setUser: (user: any) => set({ user }),
	removeUser: () => set({ user: null }),
	setUsername: (username: string) => set({ username }),
	userIsPending: true,
	setUserIsPending: (isPending: boolean) => set({ userIsPending: isPending }),
}));

export { useSupabaseUserStore };
