import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { titles } from "~/db/schema";
import type { tmdbResponse } from "~/utils/tmdbSchema";
import { TRPCError } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import { parseTmdbResponse } from "~/utils/parseTmdbResponse";

const TMDB_BASE_URL =
  "https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1";

export const titlesRouter = createTRPCRouter({
  quickAdd: publicProcedure
    .input(z.string().min(2))
    .mutation(async ({ input, ctx: { db } }) => {
      const { results: apiResponse }: tmdbResponse = (await (
        await fetch(`${TMDB_BASE_URL}&query=${input}`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${env.TMDB_API_KEY}`,
          },
        })
      ).json()) as tmdbResponse;

      const data = apiResponse[0];

      if (!data) {
        throw new TRPCError({
          message: "TMDB API Invalid Response",
          code: "PARSE_ERROR",
        });
      }

      const parsedData = parseTmdbResponse(data);

      await db.insert(titles).values(parsedData);
    }),
  getAll: publicProcedure.query(async ({ ctx: { db } }) => {
    return await db.select().from(titles).orderBy(desc(titles.dateAdded));
  }),
  toggleWatched: publicProcedure
    .input(z.object({ name: z.string().min(2), isWatched: z.boolean() }))
    .mutation(async ({ input, ctx: { db } }) => {
      if (!input.isWatched) {
        await db
          .update(titles)
          .set({ isWatched: true, dateWatched: sql`now()` })
          .where(eq(titles.name, input.name));
      } else {
        await db
          .update(titles)
          .set({ isWatched: false, dateWatched: null })
          .where(eq(titles.name, input.name));
      }
    }),
  delete: publicProcedure
    .input(z.string().min(2))
    .mutation(async ({ input, ctx: { db } }) => {
      await db.delete(titles).where(eq(titles.name, input));
    }),
});
