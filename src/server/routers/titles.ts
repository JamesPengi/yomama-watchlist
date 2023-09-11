import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { titles, titlesToUsers } from "~/db/schema";
import type { TitleToUser__Insert, Title__Insert } from "~/db/drizzle";
import {
  tmdbGenreNameEnum,
  tmdbMediaTypeEnum,
  type tmdbGeneralQueryResponse,
  type tmdbMovieQueryResult,
  type tmdbTVQueryResult,
} from "~/types/tmdbSchema";
import { TRPCError } from "@trpc/server";
import { desc, eq, sql, and, inArray } from "drizzle-orm";
import {
  parseTmdbGeneralResponse,
  parseTmdbMovieResponse,
  parseTmdbTVResponse,
} from "~/utils/parseTmdbResponse";
import { db } from "~/db/drizzle";
import { generateGetOneResponse } from "~/utils/generateResponse";

const TMDB_MULTI_BASE_URL =
  "https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1";

const TMDB_MOVIE_BASE_URL = "https://api.themoviedb.org/3/movie";
const TMDB_TV_BASE_URL = "https://api.themoviedb.org/3/tv";

export const titlesRouter = router({
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
  getOne: publicProcedure.input(z.string()).query(async ({ input }) => {
    if (isNaN(Number(input))) {
      throw new TRPCError({ message: "Bad id number", code: "BAD_REQUEST" });
    }

    const dbData = await db.query.titles.findFirst({
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
      where: eq(titles.id, Number(input)),
    });

    if (!dbData) {
      throw new TRPCError({
        message: "Could not find title with given id",
        code: "NOT_FOUND",
      });
    }

    const apiResponse = (await (
      await fetch(
        `${
          dbData.mediaType === "movie" ? TMDB_MOVIE_BASE_URL : TMDB_TV_BASE_URL
        }/${dbData.tmdbId}?append_to_response=credits`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${env.TMDB_AUTH_TOKEN}`,
          },
        }
      )
    ).json()) as tmdbMovieQueryResult | tmdbTVQueryResult;

    if (!apiResponse.original_language) {
      throw new TRPCError({
        message: "Could not get title from TMDB API",
        code: "NOT_FOUND",
      });
    }

    return generateGetOneResponse(
      dbData,
      dbData.mediaType === "movie"
        ? parseTmdbMovieResponse(apiResponse as tmdbMovieQueryResult)
        : parseTmdbTVResponse(apiResponse as tmdbTVQueryResult)
    );
  }),
  search: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { results: apiResponse }: tmdbGeneralQueryResponse = (await (
      await fetch(`${TMDB_MULTI_BASE_URL}&query=${input}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${env.TMDB_AUTH_TOKEN}`,
        },
      })
    ).json()) as tmdbGeneralQueryResponse;

    return apiResponse
      .slice(0, 4)
      .map((result) => parseTmdbGeneralResponse(result));
  }),
  quickAdd: publicProcedure
    .input(z.string().min(2))
    .mutation(async ({ input }) => {
      const { results: apiResponse }: tmdbGeneralQueryResponse = (await (
        await fetch(`${TMDB_MULTI_BASE_URL}&query=${input}`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${env.TMDB_AUTH_TOKEN}`,
          },
        })
      ).json()) as tmdbGeneralQueryResponse;

      const data = apiResponse[0];

      if (!data) {
        throw new TRPCError({
          message: `Could not find '${input}' on TMDB...`,
          code: "PARSE_ERROR",
        });
      }

      const parsedData: Title__Insert = parseTmdbGeneralResponse(data);
      const returningData = await db
        .insert(titles)
        .values(parsedData)
        .returning({ titleName: titles.name, titleId: titles.id });

      if (!returningData[0]) {
        throw new TRPCError({
          message: `Could not parse data in the database...`,
          code: "PARSE_ERROR",
        });
      }
      return returningData[0];
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

      await db
        .update(titles)
        .set({
          isWatched: true,
          dateWatched: sql`now()`,
          userRating: input.userRating,
          userDescription: input.userDescription,
        })
        .where(eq(titles.id, input.titleId));

      await db.insert(titlesToUsers).values(titlesToUsersValues);
    }),
  markAsNotWatched: publicProcedure
    .input(z.object({ id: z.number().min(0) }))
    .mutation(async ({ input }) => {
      await db
        .update(titles)
        .set({
          isWatched: false,
          dateWatched: null,
          userDescription: null,
          userRating: null,
        })
        .where(eq(titles.id, input.id));

      await db.delete(titlesToUsers).where(eq(titlesToUsers.titleId, input.id));
    }),
  getRandom: publicProcedure
    .input(
      z.object({
        type: z.array(z.enum(tmdbMediaTypeEnum.options)),
        genre: z.array(z.enum(tmdbGenreNameEnum.options)),
      })
    )
    .mutation(async ({ input }) => {
      const data = await db
        .select()
        .from(titles)
        .where(
          and(
            eq(titles.isWatched, false),
            inArray(titles.mediaType, input.type),
            inArray(titles.genre, input.genre)
          )
        );
      const randomNumber = Math.floor(Math.random() * data.length);
      return data[randomNumber];
    }),
  delete: publicProcedure
    .input(z.number().min(0))
    .mutation(async ({ input }) => {
      await db.delete(titlesToUsers).where(eq(titlesToUsers.titleId, input));
      await db.delete(titles).where(eq(titles.id, input));
    }),
});
