import { Title__Insert } from "~/db/schema";
import { getReadableGenreName, tmdbGenreName, tmdbResult } from "./tmdbSchema";

export function parseTmdbResponse(data: tmdbResult): Title__Insert {
  var mediaType: "movie" | "tv" | "anime" = "movie";
  var name = data.title;

  if (data.media_type === "tv") {
    mediaType = "tv";
    name = data.name!;
    if (data.origin_country[0] === "JP" || data.origin_country[0] === "KR") {
      mediaType = "anime";
    }
  }

  const genre: tmdbGenreName = getReadableGenreName(data.genre_ids[0]!);

  return {
    name,
    mediaType,
    tmdbId: String(data.id),
    tmdbPosterPath: data.poster_path,
    tmdbOverview: data.overview,
    genre,
  };
}
