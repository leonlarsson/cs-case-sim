import { pgTable, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// To update the DB, modify this file and run "npm run db:push". This needs to be ruun manually after deploys

export const stats = pgTable("stats", t => ({
  name: t
    .text({ enum: ["total_unboxes_all", "total_unboxes_coverts"] })
    .primaryKey(),
  value: t.integer().default(0).notNull(),
}));

export const unboxes = pgTable(
  "unboxes",
  t => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    caseId: t
      .text()
      .notNull()
      .references(() => cases.id, { onUpdate: "cascade" }),
    itemId: t
      .text()
      .notNull()
      .references(() => items.id, { onUpdate: "cascade" }),
    isStatTrak: t.boolean().default(false).notNull(),
    unboxerId: t.uuid(),
    unboxedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
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
  createdAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: t
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .$onUpdate(() => new Date()),
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
    createdAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp({
        mode: "date",
        withTimezone: true,
      })
      .$onUpdate(() => new Date()),
  }),
  table => ({
    idxRarity: index().on(table.rarity),
  }),
);
