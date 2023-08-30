import { users } from "~/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { asc } from "drizzle-orm";
import { db } from "~/db/drizzle";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(users).orderBy(asc(users.name));
  }),
});
