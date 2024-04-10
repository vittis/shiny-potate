import type { AppRouter } from "potato-server/src/types";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { createTRPCClient, httpBatchLink as vanillaHttpBatchLink } from "@trpc/client";

const trpc = createTRPCReact<AppRouter>();

const trpcClient = trpc.createClient({
	links: [
		httpBatchLink({
			url: `${import.meta.env.VITE_API_URL}/trpc`,
			async headers() {
				const token = localStorage.getItem("sb-auth");
				const parsedToken = JSON.parse(token || "{}");
				return {
					authorization: `Bearer ${parsedToken.access_token}`,
				};
			},
		}),
	],
});

const vanillaTrpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${import.meta.env.VITE_API_URL}/trpc`,
			async headers() {
				const token = localStorage.getItem("sb-auth");
				const parsedToken = JSON.parse(token || "{}");
				return {
					authorization: `Bearer ${parsedToken.access_token}`,
				};
			},
		}),
	],
});

export { trpc, trpcClient, vanillaTrpc };
