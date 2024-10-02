import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export const sqlite = new Database("./db/sqlite.db");

export default drizzle(sqlite);
