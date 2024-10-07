"use server";

import db from "@/db";
import { z } from "zod";
import { items, unboxes } from "@/db/schema";
import { and, count, desc, eq, inArray, max, sql } from "drizzle-orm";
import { getOrCreateUnboxerIdCookie } from "./cookies";

/** Gets an unbox with all relations by id. */
export const findUnboxById = async (id: number) =>
  db.query.unboxes.findFirst({
    where: eq(unboxes.id, id),
    with: {
      item: true,
      case: true,
    },
  });

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
    orderBy: [desc(unboxes.id)],
    limit: 100,
  });
};

export const getTotalFilteredUnboxes = async (
  onlyCoverts?: boolean,
  onlyPersonal?: boolean,
): Promise<number> => {
  const query = await db
    .select({
      value: onlyCoverts || onlyPersonal ? count() : max(unboxes.id),
    })
    .from(unboxes)
    .where(
      and(
        onlyCoverts ? itemIsCovert : undefined,
        onlyPersonal
          ? itemIsPersonal(await getOrCreateUnboxerIdCookie())
          : undefined,
      ),
    )
    .leftJoin(items, eq(unboxes.itemId, items.id));

  return query[0].value ?? 0;
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

    return insertedUnbox;
  } catch (error) {
    console.error("Error adding item:", error);
    return false;
  }
};

// Utils
const itemIsCovert = inArray(items.rarity, ["Covert", "Extraordinary"]);
const itemIsPersonal = (id: string) => eq(unboxes.unboxerId, id);
