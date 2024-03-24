import type { AppRouter } from "potato-server/src/types";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${import.meta.env.VITE_API_URL}/trpc`,
		}),
	],
});

export { trpc };
