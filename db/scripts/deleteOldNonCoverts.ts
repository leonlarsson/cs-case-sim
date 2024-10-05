import { and, sql } from "drizzle-orm";
import db from "../index.ts";
import { unboxes } from "../schema.ts";

const deleteOldNonCovertItems = async () => {
  const operationStart = performance.now();

  // TODO: This does not work with the new relations
  const result = await db
    .delete(unboxes)
    .where(
      and(
        sql`unboxed_at < NOW() - INTERVAL '14 days'`,
        sql`rarity NOT IN ('Covert', 'Extraordinary')`,
      ),
    )
    .returning({ id: unboxes.id });

  const operationEnd = performance.now();

  console.log(
    `✓ Complete. Deleted ${result.length} rows in ${((operationEnd - operationStart) / 1000).toFixed()}s`,
  );
};

deleteOldNonCovertItems();
