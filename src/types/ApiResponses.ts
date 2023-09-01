import type { tmdbGenreName } from "~/utils/tmdbSchema";

export type getAllResponse = {
  id: number;
  tmdbId: string;
  tmdbPosterPath: string;
  tmdbOverview: string;
  name: string;
  genre: tmdbGenreName;
  mediaType: "movie" | "tv" | "anime";
  dateAdded: Date;
  isWatched: boolean;
  dateWatched: Date | null;
  userDescription: string | null;
  userRating: string | null;
  titlesToUsers: {
    user?: {
      name: string;
    };
  }[];
};
