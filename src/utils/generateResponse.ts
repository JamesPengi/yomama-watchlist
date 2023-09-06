import type { getAllResponse, getOneResponse } from "~/types/ApiResponses";
import type { getOneApiResponse } from "~/types/tmdbSchema";

export function generateGetOneResponse(
  dbData: getAllResponse,
  parsedApiResponse: getOneApiResponse
): getOneResponse {
  return {
    id: dbData.id,
    title: dbData.name,
    overview: dbData.tmdbOverview,
    posterPath: dbData.tmdbPosterPath,
    credits: parsedApiResponse.credits,
    releaseDate: parsedApiResponse.releaseDate.slice(0, 4),
    homepage: parsedApiResponse.homepage,
    runtime: parsedApiResponse.runtime,
    tagline: parsedApiResponse.tagline,
    imdbLink: parsedApiResponse.imdbLink,
    trailerLink: `https://www.youtube.com/results?search_query=${dbData.name} Official Trailer`,
    isWatched: dbData.isWatched,
    mediaType: dbData.mediaType,
    userData: dbData.isWatched
      ? {
          watched: dbData.titlesToUsers.map((user) => user.user.name),
          rating: Number(dbData.userRating) ?? 0,
          description: dbData.userDescription ?? "",
        }
      : undefined,
  };
}
