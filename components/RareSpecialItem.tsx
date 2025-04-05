"use client";

import gradeColors from "@/utils/gradeColors";
import { useAudio } from "./AudioProvider";
import { useRef } from "react";
import { APICase } from "@/types";
import { CaseRareSpecialItemModal } from "./CaseRareSpecialItemModal";

type RareSpecialItemProps = {
  title: string;
  image?: string;
  caseData: APICase;
};

export const RareSpecialItem = ({
  title,
  image = "/images/rsi/default.png",
  caseData,
}: RareSpecialItemProps) => {
  const { itemHoverSound } = useAudio();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { buttonClickSound } = useAudio();

  return (
    <>
      <button
        className="group flex w-44 flex-col gap-1 text-start transition-all"
        onMouseEnter={() => itemHoverSound.play()}
        title={`Click to see rare items from ${caseData.name}`}
        onClick={() => {
          dialogRef.current?.showModal();
          buttonClickSound.play();
        }}
      >
        <div
          className="relative flex h-32 w-44 items-center justify-center border-b-[6px] shadow-md transition-all group-hover:shadow-lg group-hover:drop-shadow-lg"
          style={{
            borderColor: gradeColors["Rare Special Item"],
          }}
        >
          <img
            src="/images/rsi/rsi-bg.png"
            alt="Rare Special Item background"
            className="h-full w-full object-cover"
            draggable={false}
          />

          <img
            src={image}
            alt="Rare Special Item"
            className="absolute p-4"
            draggable={false}
          />
        </div>

        <div className="flex flex-col px-px text-sm text-white">
          <span className="font-semibold tracking-wider">{title}</span>
          <span className="tracking-wide">
            {caseData.contains_rare.length} items (click to see)
          </span>
        </div>
      </button>

      <CaseRareSpecialItemModal dialogRef={dialogRef} caseData={caseData} />
    </>
  );
};
