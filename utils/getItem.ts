import { gradeOddsCase, gradeOddsSouvenir } from "./gradeOdds";
import { APICase, APIItem, ItemGrade } from "@/types";

// Determine if the item should be StatTrak
// 1. Case has not disabled StatTraks
// 2. Item is not Extraordinary (Gloves)
// 3. Case is not a Souvenir package
// 4. 10% chance
const itemIsStatTrak = (caseData: APICase, item: APIItem): boolean => {
  return (
    caseData.extra?.disable_stattraks !== true &&
    item.rarity.name !== "Extraordinary" &&
    caseData.type !== "Souvenir" &&
    Math.random() <= 0.1
  );
};

// This function is currently exclusively called on the server side
export default (caseData: APICase): { itemId: string; isStatTrak: boolean } => {
  // This is pretty hacky. If the case is of type "Case", use the grade odds for cases. Otherwise, use the grade odds for souvenir packages.
  const gradeOdds =
    caseData.type === "Case" ? gradeOddsCase : gradeOddsSouvenir;

  const random = Math.random();
  let cumulativeProbability = 0;

  // Iterate through each grade and determine if the random number falls within the range
  for (const grade in gradeOdds) {
    cumulativeProbability += gradeOdds[grade as ItemGrade];

    if (random <= cumulativeProbability) {
      // Item is a RSI if the grade is "Rare Special Item" or the case's custom gold chance is met
      const isRareSpecialItem =
        grade === "Rare Special Item" ||
        (typeof caseData.extra?.gold_chance === "number" &&
          Math.random() <= caseData.extra?.gold_chance);

      // If the grade is a rare special item, return a random item from "contains_rare"
      const availableItems = isRareSpecialItem
        ? caseData.contains_rare
        : caseData.contains.filter(item => item.rarity.name === grade);

      // If there are items available, return a random item
      if (availableItems.length > 0) {
        const unboxedItem = {
          ...availableItems[Math.floor(Math.random() * availableItems.length)],
        };

        // If the item is StatTrak, add the prefix to the name
        if (itemIsStatTrak(caseData, unboxedItem)) {
          const statTrakPrefix = isRareSpecialItem
            ? "★ StatTrak™ "
            : "StatTrak™ ";
          unboxedItem.name = statTrakPrefix + unboxedItem.name.replace("★", "");
        }

        // If souvenir package, add the "Souvenir" prefix
        if (caseData.type === "Souvenir") {
          unboxedItem.name = `Souvenir ${unboxedItem.name}`;
        }

        // Return the item
        return {
          itemId: unboxedItem.id,
          isStatTrak: itemIsStatTrak(caseData, unboxedItem),
        };
      }
    }
  }

  // If no valid grade is found, return a default item from "contains"
  return { itemId: caseData.contains[0].id, isStatTrak: false };
};
