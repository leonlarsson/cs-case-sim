import Link from "next/link";
import { Item } from "./Item";
import { ItemGrade } from "@/types";
import { getFilteredUnboxes } from "@/lib/repositories/unboxes";
import statTrakifyName from "@/utils/statTrakifyName";

export const GlobalItemHistory = async ({
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
          const [itemName, skinName] = unbox.item.name.split(" | ");

          const fullItemName =
            unbox.case.type === "Souvenir"
              ? `Souvenir ${itemName}`
              : statTrakifyName(itemName, unbox.isStatTrak);

          return (
            <div
              key={unbox.id}
              title={`Unboxed on ${unbox.unboxedAt.toLocaleString("se")} UTC from ${
                unbox.case.name
              }\n\nClick to open case.`}
            >
              <Link href={`/?case=${unbox.caseId}`}>
                <Item
                  itemName={fullItemName}
                  skinName={`${skinName} ${
                    unbox.item.phase ? ` (${unbox.item.phase})` : ""
                  }`}
                  grade={
                    unbox.item.name.includes("★")
                      ? "Rare Special Item"
                      : (unbox.item.rarity as ItemGrade)
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
