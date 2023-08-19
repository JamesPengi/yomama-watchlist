ALTER TABLE "titles" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "titles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "titles" ALTER COLUMN "tmdbId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "titles" ALTER COLUMN "name" SET NOT NULL;