import type { Title__Insert } from "~/db/drizzle";
import {
  getReadableGenreName,
  type tmdbGenreName,
  type tmdbGeneralQueryResult,
} from "./tmdbSchema";

export function parseTmdbResponse(data: tmdbGeneralQueryResult): Title__Insert {
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
