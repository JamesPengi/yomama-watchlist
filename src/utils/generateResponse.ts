import type {
  getAllResponse,
  getOneResponse,
  searchOptionsResponse,
} from "~/types/ApiResponses";
import {
  getReadableGenreName,
  type getOneApiResponse,
  type tmdbGeneralQueryResponse,
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

export function generateSearchResponse(
  tmdbData: tmdbGeneralQueryResponse
): searchOptionsResponse[] {
  const data = tmdbData.results.slice(0, 5);

  return data.map((title) => {
    let mediaType: tmdbMediaType = "movie";
    let titleName = title.title;
    let release_date = title.release_date!;

    if (title.media_type === "tv") {
      mediaType = "tv";
      titleName = title.name!;
      if (
        title.origin_country[0] === "JP" ||
        title.origin_country[0] === "KR"
      ) {
        mediaType = "anime";
      }
    }

    let genre: tmdbGenreName = getReadableGenreName(title.genre_ids[0]!);

    if (genre === "Animation" && mediaType === "anime") {
      if (title.genre_ids[1]) {
        genre = getReadableGenreName(title.genre_ids[1]);
      }
    }

    if (mediaType === "tv" || mediaType === "anime") {
      release_date = title.first_air_date!;
    }

    return {
      tmdbId: String(title.id),
      title: titleName,
      mediaType: mediaType,
      releaseDate: release_date.slice(0, 4),
      genre: genre,
      posterPath: title.poster_path,
    };
  });
}

export function generateSearchResults(tmdbData: tmdbGeneralQueryResult[]) {
  return tmdbData.map((title) => {
    let mediaType: tmdbMediaType = "movie";
    let titleName = title.title;
    let searchableTitle = title.original_title!;
    let release_date = title.release_date!;

    if (title.media_type === "tv") {
      mediaType = "tv";
      titleName = title.name!;
      searchableTitle = title.original_name!;
      if (
        title.origin_country[0] === "JP" ||
        title.origin_country[0] === "KR"
      ) {
        mediaType = "anime";
      }
    }

    let genre: tmdbGenreName = getReadableGenreName(title.genre_ids[0]!);

    if (genre === "Animation" && mediaType === "anime") {
      if (title.genre_ids[1]) {
        genre = getReadableGenreName(title.genre_ids[1]);
      }
    }

    if (mediaType === "tv" || mediaType === "anime") {
      release_date = title.first_air_date!;
    }

    return {
      title: titleName,
      searchableTitle: searchableTitle,
      mediaType: mediaType,
      genre: genre,
      releaseDate: release_date.slice(0, 4),
      posterPath: title.poster_path,
      overview: title.overview.slice(0, 300),
    };
  });
}
