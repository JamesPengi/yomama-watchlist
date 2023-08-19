import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import postgres from "postgres";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { env } from "~/env.mjs";
import { titles } from "~/db/schema";
import { tmdbResponse } from "~/utils/tmdbSchema";
import { TRPCError } from "@trpc/server";

const BASE_URL = "https://api.themoviedb.org/3/search/multi";

export const titlesRouter = createTRPCRouter({
  quickAdd: publicProcedure
    .input(z.string().min(2))
    .mutation(async ({ input }) => {
      const { results: apiResponse }: tmdbResponse = await (
        await fetch(
          `${BASE_URL}?query=${input}&include_adult=false&language=en-US&page=1`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${env.TMDB_API_KEY}`,
            },
          }
        )
      ).json();

      const data = apiResponse[0];

      if (!data) {
        throw new TRPCError({
          message: "TMDB API Invalid Response",
          code: "PARSE_ERROR",
        });
      }

      const queryClient = postgres(env.DATABASE_URL);
      const db: PostgresJsDatabase = drizzle(queryClient);

      const dbResponse = await db
        .insert(titles)
        .values({
          name: data.name ? data.name : data.title!,
          tmdbId: String(data.id),
          tmdbPosterPath: data.poster_path,
        })
        .returning({
          id: titles.id,
          name: titles.name,
        });

      return dbResponse[0];
    }),
});
