import type { getAllResponse, getOneResponse } from "~/types/ApiResponses";
import {
  getReadableGenreName,
  type getOneApiResponse,
  type tmdbGenreName,
  type tmdbMediaType,
  type tmdbGeneralQueryResult,
} from "~/types/tmdbSchema";

export function generateGetOneResponse(
  dbData: getAllResponse,
  parsedApiResponse: getOneApiResponse
): getOneResponse {
  return {
    id: dbData.id,
    tmdbId: dbData.tmdbId,
    title: dbData.name,
    overview: parsedApiResponse.overview,
    posterPath: parsedApiResponse.poster_path,
    credits: parsedApiResponse.credits,
    releaseDate: parsedApiResponse.releaseDate.slice(0, 4),
    homepage: parsedApiResponse.homepage,
    runtime: parsedApiResponse.runtime,
    tagline: parsedApiResponse.tagline,
    imdbLink: parsedApiResponse.imdbLink,
    trailerLink: `https://www.youtube.com/results?search_query=${dbData.name} Official Trailer`,
    dateAdded: dbData.dateAdded,
    isWatched: dbData.isWatched,
    mediaType: dbData.mediaType,
    userData: dbData.isWatched
      ? {
          watched: dbData.titlesToUsers.map((user) => user.user.name),
          rating: Number(dbData.userRating) ?? 0,
          description: dbData.userDescription ?? "",
          dateWatched: dbData.dateWatched ?? new Date(),
        }
      : undefined,
  };
}

export function generateSearchResults(tmdbData: tmdbGeneralQueryResult[]) {
  const data = tmdbData
    .filter((title) => title.media_type !== "person")
    .map((title) => {
      let mediaType: tmdbMediaType = "movie";
      let genre: tmdbGenreName;
      const titleName = title.title ? title.title : title.name!;
      const searchableTitle = title.original_title
        ? title.original_title
        : title.original_name!;
      const release_date = title.release_date
        ? title.release_date
        : title.first_air_date
        ? title.first_air_date
        : "";

      if (title.media_type === "tv") {
        mediaType = "tv";
        if (
          title.origin_country[0] === "JP" ||
          title.origin_country[0] === "KR"
        ) {
          mediaType = "anime";
        }
      }

      if (title.genre_ids[0]) {
        genre = getReadableGenreName(title.genre_ids[0]!);
        if (genre === "Animation" && mediaType === "anime") {
          if (title.genre_ids[1]) {
            genre = getReadableGenreName(title.genre_ids[1]);
          }
        }
      } else {
        genre = "Unknown";
      }

      const data = {
        title: titleName,
        searchableTitle: searchableTitle,
        mediaType: mediaType,
        genre: genre,
        releaseDate: release_date !== "" ? release_date.slice(0, 4) : "",
        posterPath: title.poster_path,
        overview: title.overview.slice(0, 300),
        popularity: title.popularity,
      };
      return data;
    })
    .sort((a, b) => b.popularity - a.popularity);
  return data;
}
