import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: "./db/sqlite.db",
  },
  migrations: {
    table: "migrations",
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
