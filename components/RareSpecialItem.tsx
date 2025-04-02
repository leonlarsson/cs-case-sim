"use client";

import gradeColors from "@/utils/gradeColors";
import { useAudio } from "./AudioProvider";

type RareSpecialItemProps = {
  title: string;
  image?: string;
};

export const RareSpecialItem = ({
  title,
  image = "/images/rsi/default.png",
}: RareSpecialItemProps) => {
  const { itemHoverSound } = useAudio();

  return (
    <div
      className="group flex w-44 flex-col gap-1 transition-all"
      onMouseEnter={() => itemHoverSound.play()}
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
      </div>
    </div>
  );
};
