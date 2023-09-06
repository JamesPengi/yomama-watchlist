import type { Title__Insert } from "~/db/drizzle";
import {
  getReadableGenreName,
  type tmdbGenreName,
  type tmdbGeneralQueryResult,
  type tmdbTVQueryResult,
  type getOneApiResponse,
  type tmdbMovieQueryResult,
} from "../types/tmdbSchema";

export function parseTmdbGeneralResponse(
  data: tmdbGeneralQueryResult
): Title__Insert {
  let mediaType: "movie" | "tv" | "anime" = "movie";
  let name = data.title;

  if (data.media_type === "tv") {
    mediaType = "tv";
    name = data.name!;
    if (data.origin_country[0] === "JP" || data.origin_country[0] === "KR") {
      mediaType = "anime";
    }
  }

  let genre: tmdbGenreName = getReadableGenreName(data.genre_ids[0]!);

  if (genre === "Animation" && mediaType === "anime") {
    if (data.genre_ids[1]) {
      genre = getReadableGenreName(data.genre_ids[1]);
    }
  }

  return {
    name,
    mediaType,
    tmdbId: String(data.id),
    tmdbPosterPath: data.poster_path,
    tmdbOverview: data.overview,
    genre,
  };
}

export function parseTmdbTVResponse(
  data: tmdbTVQueryResult
): getOneApiResponse {
  const actors = data.credits.cast.filter((_, index) => index < 5);
  const directors = data.credits.crew
    .filter((crew) => crew.job === "Director")
    .map((director) => director.name);
  const writers = data.credits.crew
    .filter((crew) => crew.job === "Writer")
    .map((writer) => writer.name);

  return {
    id: data.id,
    title: data.name,
    releaseDate: data.first_air_date.slice(0, 4),
    homepage: data.homepage,
    runtime: null,
    tagline: data.tagline,
    imdbLink: `find/?q=${data.name}`,
    credits: {
      actors,
      directors,
      writers,
    },
  };
}

export function parseTmdbMovieResponse(
  data: tmdbMovieQueryResult
): getOneApiResponse {
  const actors = data.credits.cast.filter((_, index) => index < 5);
  const directors = data.credits.crew
    .filter((crew) => crew.job === "Director")
    .map((director) => director.name);
  const writers = data.credits.crew
    .filter((crew) => crew.job === "Writer")
    .map((writer) => writer.name);

  return {
    id: data.id,
    title: data.title,
    releaseDate: data.release_date,
    homepage: data.homepage,
    runtime: data.runtime,
    tagline: data.tagline,
    imdbLink: `title/${data.imdb_id}`,
    credits: {
      actors,
      directors,
      writers,
    },
  };
}
