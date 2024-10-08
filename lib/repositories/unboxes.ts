"use server";

import { waitUntil } from "@vercel/functions";
import { z } from "zod";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import db from "@/db";
import { items, stats, unboxes } from "@/db/schema";
import { getOrCreateUnboxerIdCookie } from "./cookies";

/** Gets the 100 latest unboxes. */
export const getFilteredUnboxes = async (
  onlyCoverts?: boolean,
  onlyPersonal?: boolean,
) => {
  return db.query.unboxes.findMany({
    with: {
      item: true,
      case: true,
    },
    where: and(
      onlyCoverts
        ? inArray(
            unboxes.itemId, // Compare unbox.itemId with item IDs from the subquery
            db
              .select({ id: items.id }) // Subquery selecting item IDs
              .from(items)
              .where(itemIsCovert), // Filter by item rarity
          )
        : undefined,
      onlyPersonal
        ? itemIsPersonal(await getOrCreateUnboxerIdCookie())
        : undefined,
    ),
    orderBy: [desc(unboxes.unboxedAt)],
    limit: 100,
  });
};

export const getTotalFilteredUnboxes = async (
  onlyCoverts?: boolean,
  onlyPersonal?: boolean,
): Promise<number> => {
  // If we're not filtering by personal unboxes, get the value from the stats table
  if (!onlyPersonal) {
    const result = await db.query.stats.findFirst({
      columns: { value: true },
      where: eq(
        stats.name,
        onlyCoverts ? "total_unboxes_coverts" : "total_unboxes_all",
      ),
    });

    return result?.value ?? 0;
  }

  const result = await db
    .select({ count: count() })
    .from(unboxes)
    .where(
      and(
        itemIsPersonal(await getOrCreateUnboxerIdCookie()),
        onlyCoverts ? itemIsCovert : undefined,
      ),
    )
    .leftJoin(items, eq(unboxes.itemId, items.id));

  return result[0].count ?? 0;
};

export const getTotalUnboxesLast24Hours = async (): Promise<number> => {
  const total = await db.$count(
    unboxes,
    sql`unboxed_at >= NOW() - INTERVAL '24 hours'`,
  );
  return total;
};

// Adds a single item to the database
export const addUnbox = async (
  caseId: string,
  itemId: string,
  isStatTrak: boolean,
) => {
  // Validate data
  const zodReturn = z
    .object({ caseId: z.string(), itemId: z.string(), isStatTrak: z.boolean() })
    .safeParse({ caseId, itemId, isStatTrak });
  if (!zodReturn.success) {
    console.error("addItemToDB: Error validating data:", zodReturn.error);
    return false;
  }

  // Get unboxerId from cookies
  const unboxerId = await getOrCreateUnboxerIdCookie();

  try {
    const insertedUnbox = await db.transaction(async tx => {
      const [insertedUnbox] = await tx
        .insert(unboxes)
        .values({
          caseId,
          itemId,
          isStatTrak,
          unboxerId,
        })
        .returning();

      const item = await tx.query.unboxes.findFirst({
        where: eq(unboxes.id, insertedUnbox.id),
        with: {
          item: true,
          case: true,
        },
      });

      return item;
    });

    if (insertedUnbox) {
      waitUntil(
        db
          .insert(stats)
          .values([
            // Always increment total unboxes
            { name: "total_unboxes_all", value: 1 },
            // Increment total covert unboxes if the item is covert
            ...(["Covert", "Extraordinary"].includes(insertedUnbox.item.rarity)
              ? [{ name: "total_unboxes_coverts" as const, value: 1 }]
              : []),
          ])
          // If the row already exists (which it will 99.9% of the time), increment the value instead
          .onConflictDoUpdate({
            target: stats.name,
            set: { value: sql`${stats.value} + 1` },
          })
          .execute(),
      );
    }

    return insertedUnbox;
  } catch (error) {
    console.error("Error adding item:", error);
    return false;
  }
};

// Query utils
const itemIsCovert = inArray(items.rarity, ["Covert", "Extraordinary"]);
const itemIsPersonal = (id: string) => eq(unboxes.unboxerId, id);
