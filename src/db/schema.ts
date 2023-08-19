import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";

export const titles = pgTable("titles", {
  id: serial("id").primaryKey(),
  tmdbId: varchar("tmdbId", { length: 20 }).notNull(),
  tmdbPosterPath: varchar("tmdbPosterPath", { length: 60 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  dateAdded: timestamp("dateAdded", { withTimezone: true }).defaultNow(),
  isWatched: boolean("isWatched").default(false),
  dateWatched: timestamp("dateWatched", { withTimezone: true }),
});

// TODO: Add people watched, rating and custom genre
