import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env.mjs";

const queryClient = postgres(env.DATABASE_URL);
export const db: PostgresJsDatabase = drizzle(queryClient);
