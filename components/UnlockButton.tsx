"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioProvider";
import UnboxedDialog from "./UnboxedDialog";
import StatsAndHistoryDialog from "./StatsAndHistoryDialog";
import Button from "./Button";
import { ItemType, ItemWithRelations } from "@/types";
import { unboxCase } from "@/lib/actions";

export default ({ caseId }: { caseId: string }) => {
  const [unboxedItems, setUnboxedItems] = useState<ItemWithRelations[]>([]);
  const [unboxedItem, setUnboxedItem] = useState<ItemWithRelations | null>(
    null,
  );
  const [unlockButtonDisabled, setUnlockButtonDisabled] = useState(false);
  const unboxedDialogRef = useRef<HTMLDialogElement>(null);
  const historyDialogRef = useRef<HTMLDialogElement>(null);

  const {
    stopAllSounds,
    milspecOpenSound,
    restrictedOpenSound,
    classifiedOpenSound,
    covertOpenSound,
    goldOpenSound,
  } = useAudio();

  // Load unboxed items from localStorage
  useEffect(() => {
    try {
      setUnboxedItems(
        JSON.parse(localStorage.getItem("unboxedItemsNew") || "[]"),
      );
    } catch (error) {
      setUnboxedItems([]);
    }
  }, []);

  const focusRetryButton = () => {
    setTimeout(() => {
      const button = [...document.querySelectorAll("button")].find(
        x => x.innerText === "RETRY",
      );
      button?.focus();
    }, 1);
  };

  const playSoundBasedOnRarity = (openedItem: ItemWithRelations) => {
    if (
      ["Consumer Grade", "Industrial Grade", "Mil-Spec Grade"].includes(
        openedItem.itemRarity ?? "",
      )
    )
      milspecOpenSound.play();

    if (openedItem.itemRarity === "Restricted") restrictedOpenSound.play();
    if (openedItem.itemRarity === "Classified") classifiedOpenSound.play();
    if (
      openedItem.itemRarity === "Covert" &&
      !openedItem.itemName?.includes("★")
    )
      covertOpenSound.play();
    if (openedItem.itemName?.includes("★")) goldOpenSound.play();
  };

  const openCase = async (dontOpenDialog?: boolean) => {
    setUnlockButtonDisabled(true);
    const openedItem = await unboxCase(caseId);
    if (!openedItem) {
      alert("Error unboxing item: Invalid case ID");
      setUnlockButtonDisabled(false);
      return;
    }

    // If the item is Covert or RSI, wait for 2 seconds before enabling the unlock button
    if (
      openedItem.itemName?.includes("★") ||
      openedItem.itemRarity === "Covert"
    ) {
      setTimeout(() => {
        setUnlockButtonDisabled(false);
        focusRetryButton();
      }, 2000);
    } else {
      setUnlockButtonDisabled(false);
      focusRetryButton();
    }

    setUnboxedItem(openedItem);
    setUnboxedItems([openedItem, ...unboxedItems]);
    localStorage.setItem(
      "unboxedItemsNew",
      JSON.stringify([openedItem, ...unboxedItems]),
    );

    // Stop all sounds and play sound based on item grade
    stopAllSounds();

    // Play sound based on item grade
    playSoundBasedOnRarity(openedItem);

    // Disable the unlock button for 2 seconds if the item is a Covert or RSI
    if (
      openedItem.itemName?.includes("★") ||
      openedItem.itemRarity === "Covert"
    ) {
      setUnlockButtonDisabled(true);
      setTimeout(() => {
        setUnlockButtonDisabled(false);

        // Focus the retry button
        setTimeout(() => {
          const button = [...document.querySelectorAll("button")].find(
            x => x.innerText === "RETRY",
          );
          button?.focus();
        }, 1);
      }, 2000);
    }

    if (dontOpenDialog) return;
    unboxedDialogRef.current?.showModal();
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => historyDialogRef.current?.showModal()}
      >
        HISTORY
      </Button>

      <Button
        variant="primary"
        disabled={unlockButtonDisabled}
        playSoundOnClick={false}
        onClick={() => openCase()}
      >
        UNLOCK CONTAINER
      </Button>

      {/* UNBOXED DIALOG */}
      <UnboxedDialog
        historyDialogRef={historyDialogRef}
        unboxedDialogRef={unboxedDialogRef}
        item={unboxedItem}
        unlockButtonDisabled={unlockButtonDisabled}
        openCaseFunc={openCase}
      />

      {/* STATS AND HISTORY DIALOG */}
      {/* <StatsAndHistoryDialog
        historyDialogRef={historyDialogRef}
        unboxedItems={unboxedItems}
        setUnboxedItems={setUnboxedItems}
      /> */}
    </>
  );
};
