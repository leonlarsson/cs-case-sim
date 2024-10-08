"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Item from "./Item";
import { APIItem, ItemGrade } from "@/types";

export default ({ onlyCoverts }: { onlyCoverts: boolean }) => {
  const [unboxedItems, setUnboxedItems] = useState<APIItem[]>([]);

  // Load unboxed items from localStorage
  useEffect(() => {
    try {
      const unboxedItemsLocalStorage = JSON.parse(
        localStorage.getItem("unboxedItemsV2") || "[]",
      );
      setUnboxedItems(
        onlyCoverts
          ? unboxedItemsLocalStorage
              .filter(
                (item: APIItem) =>
                  item.rarity.name === "Covert" ||
                  item.rarity.name === "Extraordinary",
              )
              .slice(0, 100)
          : unboxedItemsLocalStorage.slice(0, 100),
      );
    } catch (error) {
      setUnboxedItems([]);
    }
  }, [onlyCoverts]);

  return (
    <div className="flex flex-wrap justify-center gap-8 px-2 lg:px-16">
      {unboxedItems && unboxedItems.length === 0 && (
        <span>
          No items found. Go open some{" "}
          <Link href="/" className="font-medium hover:underline">
            here
          </Link>
          !
        </span>
      )}

      {unboxedItems ? (
        unboxedItems.map((item, i) => {
          const [itemName, skinName] = unboxedItems
            ? item.name.split(" | ")
            : [null, null];

          return (
            <Item
              key={i}
              itemName={itemName ?? ""}
              skinName={`${skinName ?? ""} ${
                item.phase ? ` (${item.phase})` : ""
              }`}
              grade={
                item.name.includes("★")
                  ? "Rare Special Item"
                  : (item.rarity.name as ItemGrade)
              }
              image={item.image}
            />
          );
        })
      ) : (
        <span>Error loading items :(</span>
      )}
    </div>
  );
};

export const TotalSpend = ({ onlyCoverts }: { onlyCoverts: boolean }) => {
  const [unboxedItemsAmount, setUnboxedItemsAmount] = useState<number>(0);

  // Load unboxed items from localStorage
  useEffect(() => {
    try {
      const unboxedItemsLocalStorage = JSON.parse(
        localStorage.getItem("unboxedItemsV2") || "[]",
      );
      setUnboxedItemsAmount(
        onlyCoverts
          ? unboxedItemsLocalStorage.filter(
              (item: APIItem) =>
                item.rarity.name === "Covert" ||
                item.rarity.name === "Extraordinary",
            ).length
          : unboxedItemsLocalStorage.length,
      );
    } catch (error) {
      setUnboxedItemsAmount(0);
    }
  }, [onlyCoverts]);

  return (
    <span className="text-center">
      <span className="font-medium">
        {unboxedItemsAmount.toLocaleString("en")}
      </span>{" "}
      {onlyCoverts ? "coverts" : "items"} unboxed.{" "}
      <span className="font-medium">
        {(unboxedItemsAmount * 2.35).toLocaleString("en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        €
      </span>{" "}
      spent on imaginary keys.
    </span>
  );
};
