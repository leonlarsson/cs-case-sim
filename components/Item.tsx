"use client";

import { ItemGrade } from "@/types";
import { useAudio } from "./AudioProvider";
import gradeColors from "@/utils/gradeColors";

type ItemProps = {
  itemName: string;
  skinName?: string;
  image?: string;
  grade?: ItemGrade;
};

export const Item = ({
  itemName,
  skinName,
  image,
  grade = "Mil-Spec Grade",
}: ItemProps) => {
  const { itemHoverSound } = useAudio();

  return (
    <div
      className="group flex w-44 flex-col gap-1 transition-all"
      onMouseEnter={() => itemHoverSound.play()}
    >
      <div
        className="flex h-32 w-44 items-center justify-center border-b-[6px] bg-gradient-to-b from-neutral-600 to-neutral-400 shadow-md transition-all group-hover:shadow-lg group-hover:drop-shadow-lg"
        style={{
          borderColor: gradeColors[grade] ?? gradeColors["Mil-Spec Grade"],
        }}
      >
        <img
          className="p-2"
          src={image ?? "/images/m4a4_howl.png"}
          alt={`${itemName} image`}
          draggable={false}
        />
      </div>

      <div className="flex flex-col px-px text-sm text-white">
        <span className="font-semibold tracking-wider">{itemName}</span>
        <span className="tracking-wide">{skinName}</span>
      </div>
    </div>
  );
};
