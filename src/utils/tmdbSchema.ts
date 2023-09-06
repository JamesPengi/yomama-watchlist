import { z } from "zod";

export type tmdbGeneralQueryResult = {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name?: string;
  title: string;
  original_language: string;
  original_name?: string;
  original_title?: string;
  overview: string;
  poster_path: string;
  media_type: "movie" | "tv";
  genre_ids: number[];
  popularity: number;
  first_air_date?: string;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
};

export type tmdbGeneralQueryResponse = {
  page: number;
  results: tmdbGeneralQueryResult[];
  total_pages: number;
  total_results: number;
};

export type tmdbMovieQueryResult = {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  credits: tmdbCredits;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  tagline: string;
  title: string;
  vote_average: number;
  vote_count: number;
};

export type tmdbTVQueryResult = {
  adult: boolean;
  backdrop_path: string;
  credits: tmdbCredits;
  first_air_date: string;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  name: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: string;
  poster_path: string;
  episode_runtime: number[];
  tagline: string;
  vote_average: number;
  vote_count: number;
};

export type tmdbCredits = {
  cast: {
    id: number;
    known_for_department: string;
    name: string;
    profile_path: string;
    character: string;
  }[];
  crew: {
    id: number;
    name: string;
    known_for_department: string;
    profile_path: string;
    department: string;
    job: string;
  };
};

export type getOneApiResponse = {
  id: number;
  title: string;
  credits: tmdbCredits;
  releaseDate: string;
  homepage: string;
  runtime: number;
  tagline: string;
  imdbLink: string;
};

export const tmdbMediaTypeEnum = z.enum(["movie", "tv", "anime"]);
export type tmdbMediaType = z.infer<typeof tmdbMediaTypeEnum>;

export const tmdbGenreNameEnum = z.enum([
  "Action",
  "Action & Adventure",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Kids",
  "Music",
  "Mystery",
  "News",
  "Reality",
  "Romance",
  "Sci-Fi & Fantasy",
  "Science Fiction",
  "Soap",
  "Talk",
  "TV Movie",
  "Thriller",
  "War",
  "War & Politics",
  "Western",
  "Unknown",
]);
export type tmdbGenreName = z.infer<typeof tmdbGenreNameEnum>;

export function getReadableGenreName(id: number): tmdbGenreName {
  switch (id) {
    case 28:
      return "Action";
    case 10759:
      return "Action & Adventure";
    case 12:
      return "Adventure";
    case 16:
      return "Animation";
    case 35:
      return "Comedy";
    case 80:
      return "Crime";
    case 99:
      return "Documentary";
    case 18:
      return "Drama";
    case 10751:
      return "Family";
    case 14:
      return "Fantasy";
    case 36:
      return "History";
    case 27:
      return "Horror";
    case 10762:
      return "Kids";
    case 10402:
      return "Music";
    case 9648:
      return "Mystery";
    case 10763:
      return "News";
    case 10764:
      return "Reality";
    case 10749:
      return "Romance";
    case 10765:
      return "Sci-Fi & Fantasy";
    case 878:
      return "Science Fiction";
    case 10766:
      return "Soap";
    case 10767:
      return "Talk";
    case 10770:
      return "TV Movie";
    case 53:
      return "Thriller";
    case 10752:
      return "War";
    case 10768:
      return "War & Politics";
    case 37:
      return "Western";
    default:
      return "Unknown";
  }
}
