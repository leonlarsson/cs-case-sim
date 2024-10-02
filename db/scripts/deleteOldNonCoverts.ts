import { and, sql } from "drizzle-orm";
import db from "../index.ts";
import { items } from "../schema.ts";

const deleteOldNonCovertItems = async () => {
  const operationStart = performance.now();

  const result = await db
    .delete(items)
    .where(
      and(
        sql`unboxed_at < datetime('now', '-14 days')`,
        sql`rarity NOT IN ('Covert', 'Extraordinary')`,
      ),
    );

  const operationEnd = performance.now();

  console.log(
    `✓ Complete. Deleted ${result.changes} rows in ${((operationEnd - operationStart) / 1000).toFixed()}s`,
  );
};

deleteOldNonCovertItems();
