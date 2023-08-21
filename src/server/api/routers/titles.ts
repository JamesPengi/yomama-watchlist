import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import postgres from "postgres";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { env } from "~/env.mjs";
import { titles } from "~/db/schema";
import { tmdbResponse } from "~/utils/tmdbSchema";
import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";
import { parseTmdbResponse } from "~/utils/parseTmdbResponse";

const TMDB_BASE_URL =
  "https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1";

export const titlesRouter = createTRPCRouter({
  quickAdd: publicProcedure
    .input(z.string().min(2))
    .mutation(async ({ input }) => {
      const { results: apiResponse }: tmdbResponse = await (
        await fetch(`${TMDB_BASE_URL}&query=${input}`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${env.TMDB_API_KEY}`,
          },
        })
      ).json();

      const data = apiResponse[0];

      if (!data) {
        throw new TRPCError({
          message: "TMDB API Invalid Response",
          code: "PARSE_ERROR",
        });
      }

      const parsedData = parseTmdbResponse(data);
      const queryClient = postgres(env.DATABASE_URL);
      const db: PostgresJsDatabase = drizzle(queryClient);

      await db.insert(titles).values(parsedData);
    }),
  getAll: publicProcedure.query(async () => {
    const queryClient = postgres(env.DATABASE_URL);
    const db: PostgresJsDatabase = drizzle(queryClient);

    return await db.select().from(titles).orderBy(desc(titles.dateAdded));
  }),
});
