"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioProvider";
import UnboxedDialog from "./UnboxedDialog";
import StatsAndHistoryDialog from "./StatsAndHistoryDialog";
import Button from "./Button";
import { CaseDataType, GradeType, ItemType } from "@/types";
import { addItemsToDB } from "@/lib/actions";
import getItem from "@/utils/getItem";

export default ({ caseData }: { caseData: CaseDataType }) => {
  const [unboxedItems, setUnboxedItems] = useState<ItemType[]>([]);
  const [unboxedItem, setUnboxedItem] = useState<ItemType | null>(null);
  const [unlockButtonDisabled, setUnlockButtonDisabled] = useState(false);
  const unboxedDialogRef = useRef<HTMLDialogElement>(null);
  const historyDialogRef = useRef<HTMLDialogElement>(null);
  const itemBuffer = useRef<{ caseData: CaseDataType; itemData: ItemType }[]>(
    [],
  );

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

  const sendBatchToDB = () => {
    if (itemBuffer.current.length > 0) {
      const formattedData = itemBuffer.current.map(data => ({
        caseData: {
          id: data.caseData.id,
          name: data.caseData.name,
          image: data.caseData.image,
        },
        itemData: data.itemData,
      }));

      addItemsToDB(formattedData);
      itemBuffer.current = [];
    }
  };

  // Set up the initial interval
  useEffect(() => {
    // Send the batch to the DB every 5 seconds
    const timer = setInterval(() => {
      sendBatchToDB();
    }, 5000);

    // Cleanup function
    return () => {
      clearInterval(timer);
    };
  }, []);

  const openCase = (dontOpenDialog?: boolean) => {
    const openedItem = getItem(caseData, itemBuffer);
    setUnboxedItem(openedItem);
    setUnboxedItems([openedItem, ...unboxedItems]);
    localStorage.setItem(
      "unboxedItemsNew",
      JSON.stringify([openedItem, ...unboxedItems]),
    );

    // Stop all sounds and play sound based on item grade
    stopAllSounds();

    // Play sound based on item grade
    if (
      ["Consumer Grade", "Industrial Grade", "Mil-Spec Grade"].includes(
        openedItem.rarity.name,
      )
    )
      milspecOpenSound.play();

    if (openedItem.rarity.name === "Restricted") restrictedOpenSound.play();
    if (openedItem.rarity.name === "Classified") classifiedOpenSound.play();
    if (openedItem.rarity.name === "Covert" && !openedItem.name.includes("★"))
      covertOpenSound.play();
    if (openedItem.name.includes("★")) goldOpenSound.play();

    // Disable the unlock button for 2 seconds if the item is a Covert or RSI
    if (openedItem.name.includes("★") || openedItem.rarity.name === "Covert") {
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
      <StatsAndHistoryDialog
        historyDialogRef={historyDialogRef}
        unboxedItems={unboxedItems}
        setUnboxedItems={setUnboxedItems}
      />
    </>
  );
};
