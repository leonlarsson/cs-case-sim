import { InferModelFromColumns, InferSelectModel } from "drizzle-orm";
import { unboxes } from "./db/schema";
import db from "./db";

export type ItemType = {
  /** Extra properties from custom case API */
  extra?: {
    // Description to display in unboxing modal
    description?: string;
  };
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

export type GradeType =
  | "Consumer Grade"
  | "Industrial Grade"
  | "Mil-Spec Grade"
  | "Restricted"
  | "Classified"
  | "Covert"
  | "Rare Special Item";

export type CaseDataType = {
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
  contains: ItemType[];
  contains_rare: ItemType[];
};

export type CasePickerCaseType = Pick<
  CaseDataType,
  "id" | "name" | "description" | "image" | "first_sale_date"
>;

export type ItemTypeDB = InferSelectModel<typeof unboxes>;

const query = db.query.unboxes.findMany({
  with: {
    item: true,
    case: true,
  },
});

export type UnboxWithAllRelations = Awaited<
  ReturnType<(typeof query)["execute"]>
>[number];
