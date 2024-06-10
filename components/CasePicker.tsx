"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// @ts-expect-error
import useSound from "use-sound";
import Button from "./Button";
import Icons from "./icons";
import { CaseDataType } from "@/types";

export default ({
  availableCases,
}: {
  availableCases: Pick<CaseDataType, "id" | "name" | "description" | "image">[];
}) => {
  const router = useRouter();
  const [caseSearch, setCaseSearch] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const caseParam = useSearchParams().get("case");
  const [playClick] = useSound("/audio/selectclick.mp3");
  const [playCaseSound, { stop: stopCaseSound }] = useSound(
    "/audio/caseselect.mp3",
  );

  const featuredCases: Pick<
    CaseDataType,
    "id" | "name" | "description" | "image"
  >[] = [];

  const selectCase = (id?: string) => {
    startTransition(() => {
      stopCaseSound();
      playCaseSound();
      router.replace(
        `/?case=${
          id ??
          availableCases[Math.floor(Math.random() * availableCases.length)].id
        }`,
      );
    });
  };

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const selectedCase =
    availableCases.find(x => x.id === caseParam) ?? availableCases[0];

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary-darker"
        className="flex w-full items-center justify-between gap-2 overflow-hidden py-0 text-center backdrop-blur-md min-[800px]:w-[540px]"
        playSoundOnClick={false}
        onClick={() => {
          playClick();
          openModal();
        }}
      >
        <span className="whitespace-nowrap">{selectedCase.name}</span>
        <img
          style={{
            height: 40,
          }}
          src={selectedCase.image}
          alt={selectedCase.name}
        />
      </Button>

      <Button
        variant="secondary-darker"
        className="py-0 backdrop-blur-md"
        playSoundOnClick={false}
        onClick={selectCase}
      >
        {pending ? (
          <Icons.arrowRotate className="animate-spin" />
        ) : (
          <Icons.shuffle />
        )}
      </Button>

      {/* MODAL */}
      <dialog
        ref={dialogRef}
        className="mx-auto w-full max-w-4xl bg-[#2d2d2d]/50 text-white backdrop-blur-xl backdrop:bg-black/30 backdrop:backdrop-blur"
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between bg-[#262626]/70 p-3 text-3xl font-semibold text-neutral-400">
            <div>
              Select a case!{" "}
              <Button
                variant="secondary-darker"
                onClick={() => {
                  selectCase();
                  closeModal();
                }}
              >
                <Icons.shuffle className="size-5" />
              </Button>
            </div>
            <Button variant="secondary-darker" onClick={closeModal}>
              <Icons.xMark className="size-6" />
            </Button>
          </div>

          <input
            type="search"
            placeholder="Search..."
            className="m-2 mb-0 rounded px-2 py-1 text-lg outline-none"
            value={caseSearch}
            onChange={e => setCaseSearch(e.currentTarget.value)}
          />

          {/* List cases */}
          <div className="flex flex-col gap-2 p-2">
            {/* Featured cases */}
            {featuredCases.length > 0 && (
              <>
                <div>
                  <span className="text-lg font-semibold">Featured Case:</span>
                  {[availableCases[0]].map(caseData => (
                    <Button
                      key={caseData.id}
                      variant="secondary-darker"
                      className="flex w-full items-center gap-2 p-2 text-left backdrop-blur-md"
                      playSoundOnClick={false}
                      onClick={() => {
                        selectCase(caseData.id);
                        closeModal();
                      }}
                    >
                      <img
                        src={caseData.image}
                        style={{ height: 50 }}
                        loading="lazy"
                      />
                      <div className="flex flex-col">
                        {caseData.name}
                        <span className="text-sm font-normal opacity-70">
                          {caseData.description}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>

                <hr className="my-2" />
              </>
            )}

            {/* All matching cases */}
            {availableCases
              .filter(x =>
                x.name.toLowerCase().includes(caseSearch.toLowerCase()),
              )
              .map(caseData => (
                <Button
                  key={caseData.id}
                  variant="secondary-darker"
                  className="flex items-center gap-2 p-2 text-left backdrop-blur-md"
                  playSoundOnClick={false}
                  onClick={() => {
                    selectCase(caseData.id);
                    closeModal();
                  }}
                >
                  <img
                    src={caseData.image}
                    style={{ height: 50 }}
                    loading="lazy"
                    alt={caseData.name}
                  />
                  <div className="flex flex-col">
                    {caseData.name}
                    <span className="text-sm font-normal opacity-70">
                      {caseData.description}
                    </span>
                  </div>
                </Button>
              ))}

            {/* No cases found */}
            {availableCases.filter(x =>
              x.name.toLowerCase().includes(caseSearch.toLowerCase()),
            ).length === 0 && (
              <>
                <span className="text-lg">No cases found.</span>
                <Button
                  variant="primary"
                  className="flex items-center gap-2"
                  onClick={() => {
                    selectCase();
                    closeModal();
                  }}
                >
                  Random Case
                  <Icons.shuffle />
                </Button>
              </>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};
