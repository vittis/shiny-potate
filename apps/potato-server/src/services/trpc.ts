import { initTRPC } from "@trpc/server";
import { createTRPCContext } from "../routes/context";
import { ZodError } from "zod";

const t = initTRPC.context<typeof createTRPCContext>().create({
	errorFormatter(opts) {
		const { shape, error } = opts;
		return {
			...shape,
			data: {
				...shape.data,
				// helper to detect validation error
				zodError:
					error.code === "BAD_REQUEST" && error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		};
	},
});

export const publicProcedure = t.procedure;
export const router = t.router;
