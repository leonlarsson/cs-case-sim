import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./db/schema.ts",
  migrations: {
    table: "case_sim_items_migrations",
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!.replace(
      "?sslaccept=strict",
      '?ssl={"rejectUnauthorized":true}',
    ),
  },
  tablesFilter: ["case_sim_items"],
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
