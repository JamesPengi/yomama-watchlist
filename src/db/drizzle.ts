import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";
import { env } from "~/env.mjs";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

const queryClient = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(queryClient, { schema });

export type Title = InferSelectModel<typeof schema.titles>;
export type Title__Insert = InferInsertModel<typeof schema.titles>;

export type User = InferSelectModel<typeof schema.users>;

export type TitleToUser__Insert = InferInsertModel<typeof schema.titlesToUsers>;
