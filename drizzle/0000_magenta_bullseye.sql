CREATE TYPE "public"."genre" AS ENUM('Action', 'Action & Adventure', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Kids', 'Music', 'Mystery', 'News', 'Reality', 'Romance', 'Sci-Fi & Fantasy', 'Science Fiction', 'Soap', 'Talk', 'TV Movie', 'Thriller', 'War', 'War & Politics', 'Western', 'Unknown');--> statement-breakpoint
CREATE TYPE "public"."mediaType" AS ENUM('movie', 'tv', 'anime');--> statement-breakpoint
CREATE TABLE "titles" (
	"id" serial PRIMARY KEY NOT NULL,
	"tmdbId" varchar(20) NOT NULL,
	"name" varchar(256) NOT NULL,
	"genre" "genre" NOT NULL,
	"mediaType" "mediaType" NOT NULL,
	"dateAdded" timestamp with time zone DEFAULT now() NOT NULL,
	"isWatched" boolean DEFAULT false NOT NULL,
	"dateWatched" timestamp with time zone,
	"userDescription" text,
	"userRating" numeric
);
--> statement-breakpoint
CREATE TABLE "titles_to_users" (
	"title_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "titles_to_users_title_id_user_id_pk" PRIMARY KEY("title_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "titles_to_users" ADD CONSTRAINT "titles_to_users_title_id_titles_id_fk" FOREIGN KEY ("title_id") REFERENCES "public"."titles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "titles_to_users" ADD CONSTRAINT "titles_to_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;