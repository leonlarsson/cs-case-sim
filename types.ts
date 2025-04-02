import db from "./db";

/** APICase is the case structure from the API. */
export type APICase = {
  /** Extra properties from custom cases */
  extra?: {
    // Case gold chance (0-1)
    gold_chance?: number;
    // Whether or not the case should not give StatTraks
    disable_stattraks?: boolean;
  };
  id: string;
  type: string | null;
  first_sale_date: string | null;
  name: string;
  description: string | null;
  image: string;
  contains: APIItem[];
  contains_rare: APIItem[];
  loot_list: {
    name: string;
    footer: string;
    image: string;
  } | null;
};

/** ItemType is the item structure from the API. */
export type APIItem = {
  id: string;
  name: string;
  rarity: {
    id: string;
    name: string;
    color: string;
  };
  phase?: string | null;
  image: string;
};

/** IndexedDBItem is the item structure saved to IndexedDB. */
export type IndexedDBItem = {
  id: string;
  name: string;
  rarity: string;
  phase: string | null;
};

/** GradeType is the possible item rarities. */
export type ItemGrade =
  | "Consumer Grade"
  | "Industrial Grade"
  | "Mil-Spec Grade"
  | "Restricted"
  | "Classified"
  | "Covert"
  | "Rare Special Item";

/** CasePickerCase is the APICase data being passed to the case picker */
export type CasePickerCase = Pick<
  APICase,
  "id" | "name" | "description" | "image" | "first_sale_date"
>;

// DB types

const query = db.query.unboxes.findMany({
  with: {
    item: true,
    case: true,
  },
});

/** UnboxWithAllRelations is the unbox item with all relations loaded. */
export type UnboxWithAllRelations = Awaited<
  ReturnType<(typeof query)["execute"]>
>[number];
