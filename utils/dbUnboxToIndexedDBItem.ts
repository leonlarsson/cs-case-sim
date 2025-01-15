import { IndexedDBItem, UnboxWithAllRelations } from "@/types";
import statTrakifyName from "./statTrakifyName";

export const dbUnboxToIndexedDBItem = (
  dbUnbox: UnboxWithAllRelations,
): IndexedDBItem => {
  return {
    id: dbUnbox.item.id,
    name: statTrakifyName(dbUnbox.item.name, dbUnbox.isStatTrak),
    rarity: dbUnbox.item.rarity,
    phase: dbUnbox.item.phase,
  };
};
