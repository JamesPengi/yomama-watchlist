import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "~/env.mjs";
import { InferModel } from "drizzle-orm";

const queryClient = postgres(env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });

export type Title = InferModel<typeof schema.titles, "select">;
export type Title__Insert = InferModel<typeof schema.titles, "insert">;

export type User = InferModel<typeof schema.users, "select">;

export type TitleToUser__Insert = InferModel<
  typeof schema.titlesToUsers,
  "insert"
>;
