ALTER TYPE "genre" ADD VALUE 'Unknown';--> statement-breakpoint
ALTER TABLE "titles" ALTER COLUMN "isWatched" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "titles" ADD COLUMN "userDescription" text;--> statement-breakpoint
ALTER TABLE "titles" ADD COLUMN "userRating" numeric;