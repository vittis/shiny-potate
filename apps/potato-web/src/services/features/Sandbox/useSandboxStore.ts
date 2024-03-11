import { create } from "zustand";

interface SandboxState {
	shopTier: string;
	setShopTier: (tier: string) => void;
}

const useSandboxStore = create<SandboxState>()(set => ({
	shopTier: "-1",
	setShopTier: (tier: string) => set({ shopTier: tier }),
}));

export { useSandboxStore };
