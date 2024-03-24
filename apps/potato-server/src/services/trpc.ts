import { initTRPC } from "@trpc/server";
import { HonoRequest } from "hono";

export const createContext = async (opts: { req: HonoRequest; resHeaders: any }) => {
	const bagulho = { kek: "w" };

	return {
		bagulho,
	};
};

const t = initTRPC.context<typeof createContext>().create();

/* t.procedure.use(({ ctx, next }) => {
	console.log("opa");
	console.log(ctx.bagulho);

	return next();
}); */

export const publicProcedure = t.procedure;
export const router = t.router;
