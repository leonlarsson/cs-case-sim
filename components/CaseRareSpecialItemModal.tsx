import { APICase } from "@/types";
import Button from "./Button";
import { Item } from "./Item";
import gradeColors from "@/utils/gradeColors";

type CaseRareSpecialItemModalProps = {
  dialogRef: React.RefObject<HTMLDialogElement>;
  caseData: APICase;
};

export const CaseRareSpecialItemModal = ({
  dialogRef,
  caseData,
}: CaseRareSpecialItemModalProps) => {
  return (
    <dialog
      className="mx-auto w-full max-w-5xl border-[1px] border-white/30 bg-[#2d2d2d]/50 text-xl text-white outline-none backdrop-blur-xl backdrop:bg-black/30 backdrop:backdrop-blur-sm"
      ref={dialogRef}
    >
      <div className="flex flex-col">
        <span className="sticky inset-0 z-50 flex items-center justify-between bg-[#262626] p-3 text-3xl font-semibold text-neutral-400">
          <span>{caseData.name} Rare Items</span>

          <Button
            variant="secondary-darker"
            onClick={() => dialogRef.current?.close()}
          >
            CLOSE
          </Button>
        </span>

        <div className="flex flex-col gap-3 p-4">
          <p>
            These are the {caseData.contains_rare.length} rare{" "}
            {caseData.contains_rare.length === 1 ? "item" : "items"} you can
            unbox from this case:
          </p>

          <hr
            style={{
              height: 5,
              border: "none",
              marginBottom: 8,
              backgroundColor: gradeColors["Rare Special Item"],
            }}
          />

          <div className="flex flex-wrap justify-center gap-5">
            {caseData.contains_rare.map(item => {
              const [itemName, skinName] = item.name.split(" | ");
              const fullSkinName = item.phase
                ? `${skinName} (${item.phase})`
                : skinName;
              return (
                <Item
                  key={item.id}
                  itemName={itemName}
                  skinName={fullSkinName}
                  image={item.image}
                  grade="Rare Special Item"
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end p-2">
        <Button
          variant="secondary-darker"
          className="self-end"
          onClick={() => dialogRef.current?.close()}
        >
          CLOSE
        </Button>
      </div>
    </dialog>
  );
};
