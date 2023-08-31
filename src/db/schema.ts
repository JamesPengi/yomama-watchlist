import { relations } from "drizzle-orm";
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
import { tmdbGenreNameEnum, tmdbMediaTypeEnum } from "~/utils/tmdbSchema";

export const genreEnum = pgEnum("genre", tmdbGenreNameEnum.options);

export const mediaTypeEnum = pgEnum("mediaType", tmdbMediaTypeEnum.options);

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
