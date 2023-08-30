import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { titles, titlesToUsers } from "~/db/schema";
import type { TitleToUser__Insert, Title__Insert } from "~/db/drizzle";
import type { tmdbResponse } from "~/utils/tmdbSchema";
import { TRPCError } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import { parseTmdbResponse } from "~/utils/parseTmdbResponse";
import { db } from "~/db/drizzle";

const TMDB_BASE_URL =
  "https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1";

export const titlesRouter = router({
  quickAdd: publicProcedure
    .input(z.string().min(2))
    .mutation(async ({ input }) => {
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

      const parsedData: Title__Insert = parseTmdbResponse(data);

      await db.insert(titles).values(parsedData);
    }),
  getAll: publicProcedure.query(async () => {
    return await db.query.titles.findMany({
      with: {
        titlesToUsers: {
          columns: {},
          with: {
            user: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [desc(titles.dateAdded)],
    });
  }),
  markAsWatched: publicProcedure
    .input(
      z.object({
        titleId: z.number(),
        userDescription: z.string().min(2),
        userRating: z.string().min(1),
        usersWatched: z.array(z.object({ id: z.number(), name: z.string() })),
      })
    )
    .mutation(async ({ input }) => {
      const titlesToUsersValues: TitleToUser__Insert[] = [];

      input.usersWatched.forEach((value) => {
        titlesToUsersValues.push({ titleId: input.titleId, userId: value.id });
      });

      await db.transaction(async (tx) => {
        await tx
          .update(titles)
          .set({
            isWatched: true,
            dateWatched: sql`now()`,
            userRating: input.userRating,
            userDescription: input.userDescription,
          })
          .where(eq(titles.id, input.titleId));
        await tx.insert(titlesToUsers).values(titlesToUsersValues);
      });
    }),
  markAsNotWatched: publicProcedure
    .input(z.object({ id: z.number().min(0) }))
    .mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        await tx
          .update(titles)
          .set({
            isWatched: false,
            dateWatched: null,
            userDescription: null,
            userRating: null,
          })
          .where(eq(titles.id, input.id));
        await tx
          .delete(titlesToUsers)
          .where(eq(titlesToUsers.titleId, input.id));
      });
    }),
  delete: publicProcedure
    .input(z.number().min(0))
    .mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        await tx.delete(titlesToUsers).where(eq(titlesToUsers.titleId, input));
        await tx.delete(titles).where(eq(titles.id, input));
      });
    }),
});
