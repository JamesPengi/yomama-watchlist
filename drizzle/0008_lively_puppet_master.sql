CREATE TABLE IF NOT EXISTS "titles_to_users" (
	"title_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT titles_to_users_title_id_user_id PRIMARY KEY("title_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "titles_to_users" ADD CONSTRAINT "titles_to_users_title_id_titles_id_fk" FOREIGN KEY ("title_id") REFERENCES "titles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "titles_to_users" ADD CONSTRAINT "titles_to_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
