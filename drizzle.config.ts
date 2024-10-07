import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    table: "migrations",
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});