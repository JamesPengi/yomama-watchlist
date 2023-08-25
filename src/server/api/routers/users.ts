import { users } from "~/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { asc } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx: { db } }) => {
    return await db.select().from(users).orderBy(asc(users.name));
  }),
});
