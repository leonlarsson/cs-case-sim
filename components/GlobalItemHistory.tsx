import Link from "next/link";
import { getItemsFromDB } from "@/lib/actions";
import Item from "./Item";
import { GradeType } from "@/types";
import { getFilteredUnboxes } from "@/lib/repositories/unboxes";

export default async ({
  onlyCoverts,
  onlyPersonal,
}: {
  onlyCoverts: boolean;
  onlyPersonal: boolean;
}) => {
  const unboxes = await getFilteredUnboxes(onlyCoverts, onlyPersonal);

  return (
    <div className="flex flex-wrap justify-center gap-8 px-2 lg:px-16">
      {unboxes && unboxes.length === 0 && (
        <span className="text-center">
          No items found. Go open some{" "}
          <Link href="/" className="font-medium hover:underline">
            here
          </Link>
          !
        </span>
      )}

      {unboxes ? (
        unboxes.map(unbox => {
          const [itemName, skinName] = unbox.item.name
            ? unbox.item.name.split(" | ")
            : [null, null];

          const itemDisplayName = `${unbox.isStatTrak ? (itemName?.includes("★") ? "★ StatTrak™ " : "StatTrak™ ") : ""}${itemName}`;

          return (
            <div
              key={unbox.id}
              title={`Unboxed on ${new Date(unbox.unboxedAt).toLocaleString()} UTC from ${
                unbox.case.name
              }\n\nClick to open case.`}
            >
              <Link href={`/?case=${unbox.caseId}`}>
                <Item
                  itemName={itemDisplayName}
                  skinName={`${skinName} ${
                    unbox.item.phase ? ` (${unbox.item.phase})` : ""
                  }`}
                  grade={
                    unbox.item.name.includes("★")
                      ? "Rare Special Item"
                      : (unbox.item.rarity as GradeType)
                  }
                  image={unbox.item.image}
                />
              </Link>
            </div>
          );
        })
      ) : (
        <span>Error loading items :(</span>
      )}
    </div>
  );
};
