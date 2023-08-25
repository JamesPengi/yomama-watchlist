import { relations, type InferModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  serial,
  text,
  pgEnum,
  decimal,
  integer,
  primaryKey,
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
  userDescription: text("userDescription"),
  userRating: decimal("userRating"),
});

export const titlesRelation = relations(titles, ({ many }) => ({
  titlesToUsers: many(titlesToUsers),
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const usersRelation = relations(users, ({ many }) => ({
  titlesToUsers: many(titlesToUsers),
}));

export const titlesToUsers = pgTable(
  "titles_to_users",
  {
    titleId: integer("title_id")
      .notNull()
      .references(() => titles.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    pk: primaryKey(t.titleId, t.userId),
  })
);

export const titlesToUsersRelations = relations(titlesToUsers, ({ one }) => ({
  title: one(titles, {
    fields: [titlesToUsers.titleId],
    references: [titles.id],
  }),
  user: one(users, {
    fields: [titlesToUsers.userId],
    references: [users.id],
  }),
}));

export type Title = InferModel<typeof titles, "select">;
export type Title__Insert = InferModel<typeof titles, "insert">;

export type User = InferModel<typeof users, "select">;

export type TitleToUser__Insert = InferModel<typeof titlesToUsers, "insert">;
