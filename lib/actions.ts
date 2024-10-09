"use server";

import { APICase, UnboxWithAllRelations } from "@/types";
import getItem from "@/utils/getItem";
import casesLocal from "@/lib/data/cases.json";
import souvenirCasesLocal from "@/lib/data/souvenir.json";
import customCasesLocal from "@/lib/data/customCases.json";
import { addUnbox } from "./repositories/unboxes";

// Get cases on the server to prevent changing the data on the client before it's sent to the server
const casesData: APICase[] = [
  ...casesLocal,
  ...customCasesLocal,
  ...souvenirCasesLocal,
];

// Gets a case from the provided caseId, unboxes an item, adds the item to DB, and returns the unboxed item
export const unboxCase = async (caseId: string) => {
  const caseData = casesData.find(x => x.id === caseId);
  if (!caseData) {
    console.error(`unboxCase: Case id ${caseId} not found`);
    return false;
  }

  const openedItem = getItem(caseData);

  // Add item to DB if it's not a custom case
  if (!caseData.id.startsWith("crate-custom")) {
    const item = await addUnbox(
      caseData.id,
      openedItem.itemId,
      openedItem.isStatTrak,
    );

    return item;
  }

  return false;
};
