ALTER TABLE "titles" ALTER COLUMN "dateAdded" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "titles" ADD COLUMN "tmdbOverview" varchar(256) NOT NULL;