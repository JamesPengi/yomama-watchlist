DO $$ BEGIN
 CREATE TYPE "genre" AS ENUM('Action', 'Action & Adventure', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Kids', 'Music', 'Mystery', 'News', 'Reality', 'Romance', 'Sci-Fi & Fantasy', 'Science Fiction', 'Soap', 'Talk', 'TV Movie', 'Thriller', 'War', 'War & Politics', 'Western', 'Unknown Genre');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "mediaType" AS ENUM('movie', 'tv', 'anime');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "titles" ALTER COLUMN "tmdbOverview" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "titles" ADD COLUMN "genre" "genre" NOT NULL;--> statement-breakpoint
ALTER TABLE "titles" ADD COLUMN "mediaType" "mediaType" NOT NULL;