import { pgTable, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// To update the DB, modify this file and run "npm run db:sync"

export const unboxes = pgTable(
  "unboxes",
  t => ({
    // TODO: Make this a generated column (max(id) + 1) or switch to MySQL
    id: t.serial().primaryKey(),
    caseId: t
      .text()
      .notNull()
      .references(() => cases.id),
    itemId: t
      .text()
      .notNull()
      .references(() => items.id),
    isStatTrak: t.boolean().default(false).notNull(),
    unboxerId: t.uuid().notNull(),
    unboxedAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  }),
  table => ({
    idxUnboxerId: index().on(table.unboxerId),
    idxUnboxedAt: index().on(table.unboxedAt),
  }),
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

export const cases = pgTable("cases", t => ({
  id: t.text().primaryKey(),
  type: t.text(),
  name: t.text().notNull(),
  description: t.text(),
  image: t.text().notNull(),
}));

export const items = pgTable(
  "items",
  t => ({
    id: t.text().primaryKey(),
    name: t.text().notNull(),
    description: t.text(),
    image: t.text().notNull(),
    rarity: t.text().notNull(),
    phase: t.text(),
  }),
  table => ({
    idxRarity: index().on(table.rarity),
  }),
);
