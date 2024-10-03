import { sqliteTable, index, integer, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// To update the DB, modify this file and run "npm run db:push".
// This is because I don't use migrations yet because this schema already exists in the DB, and I can't add indexes easily because they already exist.
// To watch: --no-init: https://github.com/drizzle-team/drizzle-orm/discussions/2624

export const unboxes = sqliteTable(
  "unboxes",
  {
    id: integer("id").primaryKey().notNull(),
    caseId: text("case_id")
      .notNull()
      .references(() => cases.id),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id),
    isStatTrak: integer("is_stat_trak", { mode: "boolean" })
      .default(false)
      .notNull(),
    unboxerId: text("unboxer_id").notNull(),
    unboxedAt: text("unboxed_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => {
    return {
      idxUnboxerId: index("idx_unboxer_id").on(table.unboxerId),
      idxUnboxedAt: index("idx_unboxed_at").on(table.unboxedAt),
    };
  },
);

export const unboxesRelations = relations(unboxes, ({ one }) => ({
  case: one(cases, {
    fields: [unboxes.caseId],
    references: [cases.id],
  }),
  item: one(items, {
    fields: [unboxes.itemId],
    references: [items.id],
  }),
}));

export const cases = sqliteTable("cases", {
  id: text("id").primaryKey().notNull(),
  type: text("type"),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
});

export const items = sqliteTable(
  "items",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    image: text("image").notNull(),
    rarity: text("rarity").notNull(),
    phase: text("phase"),
  },
  table => {
    return {
      idxRarity: index("idx_rarity").on(table.rarity),
    };
  },
);
