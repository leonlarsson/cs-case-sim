import {
  pgTable,
  index,
  text,
  boolean,
  serial,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// To update the DB, modify this file and run "npm run db:push".
// This is because I don't use migrations yet because this schema already exists in the DB, and I can't add indexes easily because they already exist.
// To watch: --no-init: https://github.com/drizzle-team/drizzle-orm/discussions/2624

export const unboxes = pgTable(
  "unboxes",
  {
    // Make this a generated column (max(id) + 1)
    id: serial("id").primaryKey(),
    caseId: text("case_id")
      .notNull()
      .references(() => cases.id),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id),
    isStatTrak: boolean("is_stat_trak").default(false).notNull(),
    unboxerId: uuid("unboxer_id").notNull(),
    unboxedAt: timestamp("unboxed_at", { withTimezone: true })
      .defaultNow()
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

export const cases = pgTable("cases", {
  id: text("id").primaryKey(),
  type: text("type"),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
});

export const items = pgTable(
  "items",
  {
    id: text("id").primaryKey(),
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
