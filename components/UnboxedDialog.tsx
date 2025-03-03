"use client";

import Link from "next/link";
import Button from "./Button";
import gradeColors from "@/utils/gradeColors";
import Icons from "./icons";
import { ItemGrade, UnboxWithAllRelations } from "@/types";
import statTrakifyName from "@/utils/statTrakifyName";

type Props = {
  unboxedDialogRef: React.MutableRefObject<HTMLDialogElement | null>;
  historyDialogRef: React.MutableRefObject<HTMLDialogElement | null>;
  unbox: UnboxWithAllRelations | null;
  unlockButtonDisabled: boolean;
  openCaseFunc: (dontOpenDialog?: boolean) => void;
};
export default ({
  unboxedDialogRef,
  historyDialogRef,
  unbox,
  unlockButtonDisabled,
  openCaseFunc,
}: Props) => {
  const fullItemName =
    unbox?.case.type === "Souvenir"
      ? `Souvenir ${unbox?.item.name}`
      : statTrakifyName(unbox?.item.name ?? "", unbox?.isStatTrak ?? false);

  const itemShareUrl = new URL("https://twitter.com/intent/tweet");
  itemShareUrl.searchParams.set(
    "text",
    `I unboxed a ${fullItemName}${
      unbox?.item.phase ? ` (${unbox?.item.phase})` : ""
    } in the Counter-Strike Case Simulator!\n\nTry here:`,
  );
  itemShareUrl.searchParams.set("url", "case-sim.com");

  const steamMarketUrl = new URL(
    "https://steamcommunity.com/market/search?appid=730",
  );
  steamMarketUrl.searchParams.set("q", unbox?.item.name ?? "");

  return (
    <dialog
      className="mx-auto w-full max-w-lg border-[1px] border-white/30 bg-[#2d2d2d]/50 text-xl text-white backdrop-blur-xl backdrop:bg-black/30 backdrop:backdrop-blur-sm"
      ref={unboxedDialogRef}
    >
      <div className="flex flex-col">
        <div
          className="border-b-[12px] bg-[#262626]/70 p-3 text-3xl font-semibold text-neutral-400"
          style={{
            borderColor: unbox?.item.name.includes("★")
              ? gradeColors["Rare Special Item"]
              : gradeColors[unbox?.item.rarity as ItemGrade],
          }}
        >
          <span>
            You got a{" "}
            <span
              style={{
                color: unbox?.item.name.includes("★")
                  ? gradeColors["Rare Special Item"]
                  : gradeColors[unbox?.item.rarity as ItemGrade],
              }}
            >
              <Link
                href={itemShareUrl}
                target="_blank"
                title="Share this pull on X / Twitter!"
              >
                {fullItemName}{" "}
                {unbox?.item.phase ? ` (${unbox?.item.phase})` : ""}
              </Link>
            </span>
          </span>
        </div>

        <div className="flex flex-col p-2">
          {unbox?.item && (
            <div key={unbox?.item.id} className="flex justify-center">
              <img
                className="block [@media_(max-height:580px)]:hidden"
                src={unbox?.item.image}
                alt={`${unbox?.item.name} image`}
                width={512}
                height={384}
                draggable={false}
              />

              <img
                className="hidden [@media_(max-height:580px)]:block"
                src={unbox?.item.image}
                alt={`${unbox?.item.name} image`}
                width={512 / 2.7}
                height={384 / 2.7}
                draggable={false}
              />
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-1">
            <Button
              variant="secondary"
              href={steamMarketUrl.href}
              openInNewTab
              className="mr-auto flex items-center"
            >
              <Icons.steam className="size-7" />
            </Button>

            <Button
              variant="secondary"
              onClick={() => unboxedDialogRef.current?.close()}
            >
              CLOSE
            </Button>

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
              onClick={() => openCaseFunc(true)}
            >
              RETRY
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
