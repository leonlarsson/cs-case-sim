import { items } from "../schema.ts";
import db from "../index.ts";
import { sql } from "drizzle-orm";

async function concatLegacyToItemIds() {
  const operationStart = performance.now();

  console.log("Running concatLegacyToItemIds...");

  try {
    const result = await db
      .update(items)
      .set({ id: sql`CONCAT('legacy-', ${items.id})` })
      .returning({ id: items.id });
    // update "items" set "id" = CONCAT('legacy-', "items"."id"), "updated_at" = NOW();

    const operationEnd = performance.now();

    console.log(
      `✓ Complete. Updated ${result.length.toLocaleString("en")} item ids (+ many unbox cascades) in ${((operationEnd - operationStart) / 1000).toFixed()}s`,
    );
  } catch (error) {
    console.log("concatLegacyToItemIds: Error inserting items:", error);
  } finally {
    process.exit(0);
  }
}

concatLegacyToItemIds();
