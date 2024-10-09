import { LocalStorageItem, UnboxWithAllRelations } from "@/types";
import statTrakifyName from "./statTrakifyName";

export default (dbUnbox: UnboxWithAllRelations): LocalStorageItem => {
  return {
    id: dbUnbox.item.id,
    name: statTrakifyName(dbUnbox.item.name, dbUnbox.isStatTrak),
    rarity: dbUnbox.item.rarity,
    phase: dbUnbox.item.phase,
  };
};
