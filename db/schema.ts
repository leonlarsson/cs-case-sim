import {
  mysqlTable,
  index,
  primaryKey,
  int,
  varchar,
  datetime,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// To update the DB, modify this file and run "npm run db:push".
// This is because I don't use migrations yet because this schema already exists in the DB, and I can't add indexes easily because they already exist.
// To watch: --no-init: https://github.com/drizzle-team/drizzle-orm/discussions/2624
export const items = mysqlTable(
  "case_sim_items",
  {
    id: int("id").autoincrement().notNull(),
    caseId: varchar("case_id", { length: 255 }).notNull(),
    caseName: varchar("case_name", { length: 255 }).notNull(),
    caseImage: varchar("case_image", { length: 600 }).notNull(),
    itemId: varchar("item_id", { length: 255 }).notNull(),
    itemName: varchar("item_name", { length: 255 }).notNull(),
    itemImage: varchar("item_image", { length: 600 }).notNull(),
    rarity: varchar("rarity", { length: 255 }).notNull(),
    unboxedAt: datetime("unboxed_at", { mode: "date" }).default(
      sql`(CURRENT_TIMESTAMP)`,
    ),
    phase: varchar("phase", { length: 50 }),
    unboxerId: varchar("unboxer_id", { length: 36 }),
  },
  table => {
    return {
      idxRarity: index("idx_rarity").on(table.rarity),
      idxUnboxerId: index("idx_unboxer_id").on(table.unboxerId),
      idxUnboxedAt: index("idx_unboxed_at").on(table.unboxedAt),
      caseSimItemsId: primaryKey({
        columns: [table.id],
        name: "case_sim_items_id",
      }),
    };
  },
);
