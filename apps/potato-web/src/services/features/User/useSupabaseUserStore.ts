import { create } from "zustand";

interface SupabaseUserState {
	user?: any;
	username?: string;
	setUser: (user: any) => void;
	removeUser: () => void;
	setUsername: (username: string) => void;
}

const useSupabaseUserStore = create<SupabaseUserState>()(set => ({
	user: undefined,
	username: undefined,
	setUser: (user: any) => set({ user }),
	removeUser: () => set({ user: null }),
	setUsername: (username: string) => set({ username }),
}));

export { useSupabaseUserStore };
