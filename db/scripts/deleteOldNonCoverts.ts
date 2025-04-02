import { and, notInArray, sql } from "drizzle-orm";
import db from "../index.ts";
import { items, unboxes } from "../schema.ts";

async function deleteOldNonCovertItems() {
  const operationStart = performance.now();

  console.log("Running deleteOldNonCovertItems...");

  try {
    const nonCoverts = db.$with("item_ids_to_delete").as(
      db
        .select({ id: items.id })
        .from(items)
        .where(notInArray(items.rarity, ["Covert", "Extraordinary"])),
    );

    const result = await db
      .with(nonCoverts)
      .delete(unboxes)
      .where(
        and(
          sql`${unboxes.itemId} IN (SELECT id FROM item_ids_to_delete)`,
          sql`unboxed_at < NOW() - INTERVAL '14 days'`,
        ),
      )
      .returning({ id: unboxes.id });

    const operationEnd = performance.now();

    console.log(
      `✓ Complete. Deleted ${result.length.toLocaleString("en")} rows in ${((operationEnd - operationStart) / 1000).toFixed()}s`,
    );
  } catch (error) {
    console.log("deleteOldNonCovertItems: Error deleting items:", error);
  } finally {
    process.exit(0);
  }
}

deleteOldNonCovertItems();
