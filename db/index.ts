import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.ts";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

export const pg = postgres(process.env.DATABASE_URL);

export default drizzle(pg, { schema });
