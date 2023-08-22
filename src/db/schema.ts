import type { InferModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  serial,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";

export const genreEnum = pgEnum("genre", [
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

export const mediaTypeEnum = pgEnum("mediaType", ["movie", "tv", "anime"]);

export const titles = pgTable("titles", {
  id: serial("id").primaryKey(),
  tmdbId: varchar("tmdbId", { length: 20 }).notNull(),
  tmdbPosterPath: varchar("tmdbPosterPath", { length: 60 }).notNull(),
  tmdbOverview: text("tmdbOverview").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  genre: genreEnum("genre").notNull(),
  mediaType: mediaTypeEnum("mediaType").notNull(),
  dateAdded: timestamp("dateAdded", { withTimezone: true })
    .defaultNow()
    .notNull(),
  isWatched: boolean("isWatched").default(false).notNull(),
  dateWatched: timestamp("dateWatched", { withTimezone: true }),
});

// TODO: Add people watched, rating and custom genre

export type Title = InferModel<typeof titles, "select">;
export type Title__Insert = InferModel<typeof titles, "insert">;
