import { APIItem, ItemGrade } from "@/types";
import Item from "./Item";

type Props = {
  items: APIItem[];
  rareItems: APIItem[];
};

export default ({ items, rareItems }: Props) => {
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
        <Item
          itemName={
            rareItems[0].rarity.name === "Extraordinary"
              ? "★ Gloves ★"
              : "★ Rare Special Item ★"
          }
          image="/images/rsi-2.png"
          grade="Rare Special Item"
          isSpecial
        />
      )}
    </>
  );
};
