"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { CaseDataType, UnboxWithAllRelations } from "@/types";
import db from "@/db";
import { unboxes } from "@/db/schema";
import getItem from "@/utils/getItem";
import casesLocal from "@/lib/data/cases.json";
import souvenirCasesLocal from "@/lib/data/souvenir.json";
import customCasesLocal from "@/lib/data/customCases.json";
import {
  findUnboxById,
  getFilteredUnboxes,
  getTotalFilteredUnboxes,
  getTotalUnboxesLast24Hours,
} from "./repositories/unboxes";

// Get cases on the server to prevent changing the data on the client before it's sent to the server
const casesData: CaseDataType[] = [
  ...casesLocal,
  ...customCasesLocal,
  ...souvenirCasesLocal,
];

// Gets a case from the provided caseId, unboxes an item, adds the item to DB, and returns the unboxed item
export const unboxCase = async (
  caseId: string,
): Promise<UnboxWithAllRelations | false> => {
  const caseData = casesData.find(x => x.id === caseId);
  if (!caseData) {
    console.error(`unboxCase: Case id ${caseId} not found`);
    return false;
  }

  const openedItem = getItem(caseData);

  // Add item to DB if it's not a custom case
  if (!caseData.id.startsWith("crate-custom")) {
    const item = await addUnboxToDB(
      caseData.id,
      openedItem.itemId,
      openedItem.isStatTrak,
    );

    return item;
  }

  return false;
};

// Adds a single item to the database
export const addUnboxToDB = async (
  caseId: string,
  itemId: string,
  isStatTrak: boolean,
): Promise<UnboxWithAllRelations | false> => {
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
      const insertedUnbox = await tx
        .insert(unboxes)
        .values({
          caseId,
          itemId,
          isStatTrak,
          unboxerId,
        })
        .returning();

      const item = await findUnboxById(insertedUnbox[0].id);
      return item;
    });

    return insertedUnbox;
  } catch (error) {
    console.error("Error adding item:", error);
    return false;
  }
};

export const getItemsFromDB = async (
  onlyCoverts?: boolean,
  onlyPersonal?: boolean,
): Promise<UnboxWithAllRelations[]> => {
  try {
    const rows = await getFilteredUnboxes(onlyCoverts, onlyPersonal);

    return rows;
  } catch (error) {
    console.error("Error getting items:", error);
    return [];
  }
};

export const getTotalItemsFromDB = async (
  onlyCoverts?: boolean,
  onlyPersonal?: boolean,
): Promise<number | false> => {
  try {
    const totalItems = await getTotalFilteredUnboxes(onlyCoverts, onlyPersonal);
    return totalItems[0].value ?? 0;
  } catch (error) {
    console.error("Error getting total items:", error);
    return false;
  }
};

export const getTotalItemsFromDBLast24Hours = async () => {
  try {
    const totalItems = await getTotalUnboxesLast24Hours();
    return totalItems[0].value ?? 0;
  } catch (error) {
    console.error("Error getting total items from last 24 hours:", error);
    return false;
  }
};

// Gets or creates unboxerId cookie
// First checks if the unboxerId cookie is a valid UUID
// If it is, it returns the value
// If it isn't, it generates a new UUID and sets it as the unboxerId cookie
// Returns the new unboxerId
export const getOrCreateUnboxerIdCookie = async (): Promise<string> => {
  const existingUnboxerId = cookies().get("unboxerId");

  if (existingUnboxerId) {
    const isValidUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        existingUnboxerId.value,
      );
    if (isValidUUID) return existingUnboxerId.value;
  }

  const newUnboxerId = crypto.randomUUID();

  cookies().set("unboxerId", newUnboxerId, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    httpOnly: true,
  });

  return newUnboxerId;
};
