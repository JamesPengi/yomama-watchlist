CREATE TABLE IF NOT EXISTS "titles" (
	"id" serial PRIMARY KEY NOT NULL,
	"tmdbId" varchar(20),
	"name" varchar(256),
	"dateAdded" timestamp with time zone DEFAULT now(),
	"isWatched" boolean DEFAULT false,
	"dateWatched" timestamp with time zone
);
