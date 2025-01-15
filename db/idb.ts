import { IndexedDBItem } from "@/types";
import Dexie, { EntityTable } from "dexie";

export const indexedDb = new Dexie("case-sim") as Dexie & {
  unboxedItems: EntityTable<IndexedDBItem, "id">;
};

// https://dexie.org/docs/Dexie/Dexie.version()

indexedDb.version(1).stores({
  unboxedItems: "++, rarity",
});
