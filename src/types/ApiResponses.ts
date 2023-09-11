import type { tmdbGenreName, tmdbMediaType } from "~/types/tmdbSchema";

export type getAllResponse = {
  id: number;
  tmdbId: string;
  name: string;
  genre: tmdbGenreName;
  mediaType: "movie" | "tv" | "anime";
  dateAdded: Date;
  isWatched: boolean;
  dateWatched: Date | null;
  userDescription: string | null;
  userRating: string | null;
  titlesToUsers: {
    user: {
      name: string;
    };
  }[];
};

export type getOneResponse = {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  credits: {
    actors: { name: string; profile_path: string; character: string }[];
    directors: string[];
    writers: string[];
  };
  releaseDate: string;
  homepage?: string;
  runtime: number | null;
  tagline: string;
  imdbLink: string;
  trailerLink: string;
  dateAdded: Date;
  isWatched: boolean;
  mediaType: tmdbMediaType;
  userData?: {
    watched: string[];
    rating: number;
    description: string;
    dateWatched: Date;
  };
};

export type searchOptionsResponse = {
  tmdbId: string;
  title: string;
  mediaType: tmdbMediaType;
  releaseDate: string;
  genre: string;
  posterPath: string;
};
