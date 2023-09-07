import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";
import { env } from "~/env.mjs";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

neonConfig.fetchConnectionCache = true;

const queryClient = neon(env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });

export type Title = InferSelectModel<typeof schema.titles>;
export type Title__Insert = InferInsertModel<typeof schema.titles>;

export type User = InferSelectModel<typeof schema.users>;

export type TitleToUser__Insert = InferInsertModel<typeof schema.titlesToUsers>;
