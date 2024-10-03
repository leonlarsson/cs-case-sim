"use server";

import db from "@/db";
import { items, unboxes } from "@/db/schema";
import { and, count, desc, eq, inArray, max, sql } from "drizzle-orm";
import { getOrCreateUnboxerIdCookie } from "../actions";

/** Gets an unbox with all relations by id. */
export const findUnboxById = async (id: number) =>
  db.query.unboxes.findFirst({
    where: eq(unboxes.id, id),
    with: {
      item: true,
      case: true,
    },
  });

export const test = async (onlyCoverts?: boolean, onlyPersonal?: boolean) =>
  db
    .select()
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

/** Gets the 100 latest unboxes. */
export const getFilteredUnboxes = async (
  onlyCoverts?: boolean,
  onlyPersonal?: boolean,
) =>
  db.query.unboxes.findMany({
    with: {
      item: true,
      case: true,
    },
    where: and(
      onlyCoverts ? itemIsCovert : undefined,
      onlyPersonal
        ? itemIsPersonal(await getOrCreateUnboxerIdCookie())
        : undefined,
    ),
    orderBy: [desc(unboxes.id)],
    limit: 100,
  });

export const getTotalFilteredUnboxes = async (
  onlyCoverts?: boolean,
  onlyPersonal?: boolean,
) =>
  db
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

export const getTotalUnboxesLast24Hours = async () =>
  db
    .select({
      value: count(),
    })
    .from(unboxes)
    .where(sql`unboxed_at >= datetime('now', '-24 hours')`);

// Utils
const itemIsCovert = inArray(items.rarity, ["Covert", "Extraordinary"]);
const itemIsPersonal = (id: string) => eq(unboxes.unboxerId, id);
