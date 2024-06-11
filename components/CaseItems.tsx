"use client";

import { GradeType, ItemType } from "@/types";
import { AudioContext } from "./AudioContext";
import Item from "./Item";
import { useContext } from "react";

type Props = {
  items: ItemType[];
  rareItems: ItemType[];
};

export default ({ items, rareItems }: Props) => {
  const { itemHoverSound } = useContext(AudioContext);

  return (
    <>
      {items.map(item => (
        <Item
          key={item.name}
          itemName={item.name.split(" | ")[0]}
          skinName={item.name.split(" | ")[1]}
          image={item.image}
          grade={item.rarity.name as GradeType}
          playHover={() => itemHoverSound.play()}
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
          playHover={() => itemHoverSound.play()}
        />
      )}
    </>
  );
};
