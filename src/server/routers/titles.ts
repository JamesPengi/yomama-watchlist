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
  type getOneApiResponse,
} from "~/utils/tmdbSchema";
import { TRPCError } from "@trpc/server";
import { desc, eq, sql, and, inArray } from "drizzle-orm";
import { parseTmdbResponse } from "~/utils/parseTmdbResponse";
import { db } from "~/db/drizzle";

const TMDB_MULTI_BASE_URL =
  "https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1";

const TMDB_MOVIE_BASE_URL = "https://api.themoviedb.org/3/movie";
const TMDB_TV_BASE_URL = "https://api.themoviedb.org/3/tv";

export const titlesRouter = router({
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
        code: "BAD_REQUEST",
      });
    }

    let apiData: getOneApiResponse;

    if (dbData.mediaType === "movie") {
      const apiResponse = (await (
        await fetch(
          `${TMDB_MOVIE_BASE_URL}/${dbData.tmdbId}?append_to_response=credits`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${env.TMDB_AUTH_TOKEN}`,
            },
          }
        )
      ).json()) as tmdbMovieQueryResult;

      apiData = {
        id: apiResponse.id,
        title: apiResponse.title,
        credits: apiResponse.credits,
        releaseDate: apiResponse.release_date.slice(0, 4),
        homepage: apiResponse.release_date,
        runtime: apiResponse.runtime,
        tagline: apiResponse.tagline,
        imdbLink: `title/${apiResponse.imdb_id}`,
      };
    } else {
      const apiResponse = (await (
        await fetch(
          `${TMDB_TV_BASE_URL}/${dbData.tmdbId}?append_to_response=credits`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${env.TMDB_AUTH_TOKEN}`,
            },
          }
        )
      ).json()) as tmdbTVQueryResult;

      apiData = {
        id: apiResponse.id,
        title: apiResponse.name,
        credits: apiResponse.credits,
        releaseDate: apiResponse.first_air_date.slice(0, 4),
        homepage: apiResponse.homepage,
        runtime: 24,
        tagline: apiResponse.tagline,
        imdbLink: `find/?q=${apiResponse.name}`,
      };
    }

    return {
      db: dbData,
      api: apiData,
    };
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
      await db.transaction(async (tx) => {
        await tx.delete(titlesToUsers).where(eq(titlesToUsers.titleId, input));
        await tx.delete(titles).where(eq(titles.id, input));
      });
    }),
});
