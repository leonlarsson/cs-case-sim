import { APICase, APIItem, ItemGrade } from "@/types";
import { Item } from "./Item";
import { RareSpecialItem } from "./RareSpecialItem";

type Props = {
  caseData: APICase;
};

export default ({ caseData }: Props) => {
  return (
    <>
      {caseData.contains.map(item => (
        <Item
          key={item.name}
          itemName={item.name.split(" | ")[0]}
          skinName={item.name.split(" | ")[1]}
          image={item.image}
          grade={item.rarity.name as ItemGrade}
        />
      ))}

      {caseData.contains_rare.length > 0 && (
        <RareSpecialItem
          // If caseLootList exists, use its name and image, otherwise use the default logic
          title={
            caseData.loot_list?.name ??
            (caseData.contains_rare[0].rarity.name === "Extraordinary"
              ? "★ Gloves ★"
              : "★ Rare Special Item ★")
          }
          image={caseData.loot_list?.image}
          caseData={caseData}
        />
      )}
    </>
  );
};
