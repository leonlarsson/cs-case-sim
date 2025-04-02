import { APICase, APIItem, ItemGrade } from "@/types";
import { Item } from "./Item";
import { RareSpecialItem } from "./RareSpecialItem";

type Props = {
  items: APIItem[];
  rareItems: APIItem[];
  caseLootList: APICase["loot_list"];
};

export default ({ items, rareItems, caseLootList }: Props) => {
  return (
    <>
      {items.map(item => (
        <Item
          key={item.name}
          itemName={item.name.split(" | ")[0]}
          skinName={item.name.split(" | ")[1]}
          image={item.image}
          grade={item.rarity.name as ItemGrade}
        />
      ))}

      {rareItems.length > 0 && (
        <RareSpecialItem
          // If caseLootList exists, use its name and image, otherwise use the default logic
          title={
            caseLootList?.name ??
            (rareItems[0].rarity.name === "Extraordinary"
              ? "★ Gloves ★"
              : "★ Rare Special Item ★")
          }
          image={caseLootList?.image}
        />
      )}
    </>
  );
};
