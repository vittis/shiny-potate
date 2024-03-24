import { router, publicProcedure } from "../../services/trpc";

export const arenaRouter = router({
	new: publicProcedure.query(({ input }) => {
		return "ok my friend";
	}),
});
