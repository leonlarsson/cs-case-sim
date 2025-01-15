"use client";

import { useRef, useState } from "react";
import { useAudio } from "./AudioProvider";
import UnboxedDialog from "./UnboxedDialog";
import StatsAndHistoryDialog from "./StatsAndHistoryDialog";
import Button from "./Button";
import { unboxCase } from "@/lib/actions";
import { UnboxWithAllRelations } from "@/types";
import { dbUnboxToIndexedDBItem } from "@/utils/dbUnboxToIndexedDBItem";
import { indexedDb } from "@/db/idb";

export default ({ caseId }: { caseId: string }) => {
  const [unbox, setUnbox] = useState<UnboxWithAllRelations | null>(null);
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

  // Maybe later
  // useEffect(() => {
  //   // Remove old structure of unboxed items
  //   localStorage.removeItem("unboxedItemsNew");
  //   localStorage.removeItem("unboxedItemsV2");
  // }, []);

  const focusRetryButton = () => {
    setTimeout(() => {
      const button = [...document.querySelectorAll("button")].find(
        x => x.innerText === "RETRY",
      );
      button?.focus();
    }, 1);
  };

  const playSoundBasedOnRarity = (unbox: UnboxWithAllRelations) => {
    if (
      ["Consumer Grade", "Industrial Grade", "Mil-Spec Grade"].includes(
        unbox.item.rarity,
      )
    )
      milspecOpenSound.play();

    if (unbox.item.rarity === "Restricted") restrictedOpenSound.play();
    if (unbox.item.rarity === "Classified") classifiedOpenSound.play();
    if (unbox.item.rarity === "Covert" && !unbox.item.name.includes("★"))
      covertOpenSound.play();
    if (unbox.item.name.includes("★")) goldOpenSound.play();
  };

  const openCase = async (dontOpenDialog?: boolean) => {
    setUnlockButtonDisabled(true);
    const unbox = await unboxCase(caseId);

    if (!unbox) {
      alert("Error unboxing item: Invalid case ID");
      setUnlockButtonDisabled(false);
      return;
    }

    // If the item is Covert or RSI, wait for 2 seconds before enabling the unlock button
    if (unbox.item.name.includes("★") || unbox.item.rarity === "Covert") {
      setTimeout(() => {
        setUnlockButtonDisabled(false);
        focusRetryButton();
      }, 2000);
    } else {
      setUnlockButtonDisabled(false);
      focusRetryButton();
    }

    setUnbox(unbox);

    // Save unboxed item to indexedDB
    indexedDb.unboxedItems.add(dbUnboxToIndexedDBItem(unbox));

    // Stop all sounds and play sound based on item grade
    stopAllSounds();

    // Play sound based on item grade
    playSoundBasedOnRarity(unbox);

    // Disable the unlock button for 2 seconds if the item is a Covert or RSI
    if (unbox.item.name.includes("★") || unbox.item.rarity === "Covert") {
      setUnlockButtonDisabled(true);
      setTimeout(() => {
        setUnlockButtonDisabled(false);

        // Focus the retry button
        focusRetryButton();
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
        unbox={unbox}
        unlockButtonDisabled={unlockButtonDisabled}
        openCaseFunc={openCase}
      />

      {/* STATS AND HISTORY DIALOG */}
      <StatsAndHistoryDialog historyDialogRef={historyDialogRef} />
    </>
  );
};
