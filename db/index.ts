import path from "path";
import { existsSync, mkdirSync } from "fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.ts";

// Check if the directory exists
const sqliteDir = path.join(process.cwd(), "sqlite");
if (!existsSync(sqliteDir)) {
  mkdirSync(sqliteDir);
}

export const sqlite = new Database("./sqlite/sqlite.db");

export default drizzle(sqlite, { schema });
