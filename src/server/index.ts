import { router } from "~/server/trpc";
import { titlesRouter } from "./routers/titles";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  titles: titlesRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
