import { sqliteTable, index, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// To update the DB, modify this file and run "npm run db:push".
// This is because I don't use migrations yet because this schema already exists in the DB, and I can't add indexes easily because they already exist.
// To watch: --no-init: https://github.com/drizzle-team/drizzle-orm/discussions/2624

export const items = sqliteTable(
  "items",
  {
    id: integer("id").primaryKey().notNull(),
    caseId: text("case_id")
      .notNull()
      .references(() => cases.id),
    itemId: text("item_id").notNull(),
    name: text("item_name").notNull(),
    image: text("item_image").notNull(),
    rarity: text("rarity").notNull(),
    unboxedAt: text("unboxed_at").default(sql`CURRENT_TIMESTAMP`),
    phase: text("phase"),
    unboxerId: text("unboxer_id"),
  },
  table => {
    return {
      idxRarity: index("idx_rarity").on(table.rarity),
      idxUnboxerId: index("idx_unboxer_id").on(table.unboxerId),
      idxUnboxedAt: index("idx_unboxed_at").on(table.unboxedAt),
    };
  },
);

export const cases = sqliteTable("cases", {
  id: text("case_id").primaryKey().notNull(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  description: text("description"),
});
