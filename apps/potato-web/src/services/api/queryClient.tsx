import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AlertCircleIcon, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		// @ts-expect-error
		onError: (error: AxiosError<any>) => {
			toast.error(
				`Error at ${error?.config?.url}: ${
					error?.response?.data?.message || error?.response?.data?.error || error?.message
				}`,
				{ icon: AlertTriangle },
			);
		},
	}),
	mutationCache: new MutationCache({
		/* onSuccess: () => {
      toast.success("Operation successful");
    }, */
		onError: (error: any) => {
			const trpcPath = error?.meta?.responseJSON?.[0]?.error?.data?.path;

			toast.error(
				`Error at ${trpcPath || error?.config?.url}: ${
					error?.response?.data?.message || error?.response?.data?.error || error?.message
				}`,
				{
					icon: () => <AlertCircleIcon className="w-6 text-red-500" />,
				},
			);
		},
	}),
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			/* refetchOnMount: false, */
			staleTime: 10000,
			retry: false,
		},
	},
});

export { queryClient };
