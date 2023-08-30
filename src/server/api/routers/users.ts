import { users } from "~/db/schema";
import { router, publicProcedure } from "../trpc";
import { asc } from "drizzle-orm";
import { db } from "~/db/drizzle";

export const usersRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(users).orderBy(asc(users.name));
  }),
});
