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

  const [favoriteCases, setFavoriteCases] = useState<string[]>(
    localStorage.getItem("favoriteCases")
      ? JSON.parse(localStorage.getItem("favoriteCases")!)
      : [],
  );

  const featuredCases: Pick<
    CaseDataType,
    "id" | "name" | "description" | "image"
  >[] = [availableCases.find(x => x.id === "crate-4904")!];

  const selectCase = (id?: string) => {
    startTransition(() => {
      stopCaseSound();
      playCaseSound();
      closeModal();
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

  const toggleFavoriteCase = (id: string) => {
    const index = favoriteCases.indexOf(id);
    const newFavoriteCases = [...favoriteCases];

    if (index === -1) {
      newFavoriteCases.push(id);
    } else {
      newFavoriteCases.splice(index, 1);
    }

    setFavoriteCases(newFavoriteCases);
    localStorage.setItem("favoriteCases", JSON.stringify(newFavoriteCases));
  };

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
              <Button variant="secondary-darker" onClick={selectCase}>
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
                  <span className="text-lg font-semibold">
                    Featured {featuredCases.length > 1 ? "Cases" : "Case"}:
                  </span>
                  <div className="flex flex-col gap-2">
                    {featuredCases.map(caseData => (
                      <Case
                        key={caseData.id}
                        caseData={caseData}
                        showToggleFavoriteButton
                        isFavorite={favoriteCases.includes(caseData.id)}
                        selectCase={selectCase}
                        toggleFavoriteCase={toggleFavoriteCase}
                      />
                    ))}
                  </div>
                </div>

                <hr className="my-2" />
              </>
            )}

            {/* Favorite cases */}
            {favoriteCases.length > 0 && (
              <>
                <div>
                  <span className="text-lg font-semibold">Favorites:</span>
                  <div className="flex flex-col gap-2">
                    {availableCases
                      .filter(x => favoriteCases.includes(x.id))
                      .map(caseData => (
                        <Case
                          key={caseData.id}
                          caseData={caseData}
                          showToggleFavoriteButton
                          isFavorite={favoriteCases.includes(caseData.id)}
                          selectCase={selectCase}
                          toggleFavoriteCase={toggleFavoriteCase}
                        />
                      ))}
                  </div>
                </div>

                <hr className="my-2" />
              </>
            )}

            {/* All matching cases */}
            <div>
              <span className="text-lg font-semibold">
                {caseSearch
                  ? `Non-favorite cases matching "${caseSearch}"`
                  : "All Cases"}
                :
              </span>
              <div className="flex flex-col gap-2">
                {availableCases
                  .filter(
                    x =>
                      x.name.toLowerCase().includes(caseSearch.toLowerCase()) &&
                      !favoriteCases.includes(x.id),
                  )
                  .map(caseData => (
                    <Case
                      key={caseData.id}
                      caseData={caseData}
                      showToggleFavoriteButton
                      isFavorite={favoriteCases.includes(caseData.id)}
                      selectCase={selectCase}
                      toggleFavoriteCase={toggleFavoriteCase}
                    />
                  ))}
              </div>
            </div>

            {/* No cases found */}
            {availableCases.filter(x =>
              x.name.toLowerCase().includes(caseSearch.toLowerCase()),
            ).length === 0 && (
              <>
                <span className="text-lg">No cases found.</span>
                <Button
                  variant="primary"
                  className="flex items-center gap-2"
                  onClick={selectCase}
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

const Case = ({
  caseData,
  showToggleFavoriteButton,
  selectCase,
  isFavorite,
  toggleFavoriteCase,
}: {
  caseData: Pick<CaseDataType, "id" | "name" | "description" | "image">;
  showToggleFavoriteButton?: boolean;
  selectCase: (id: string) => void;
  isFavorite: boolean;
  toggleFavoriteCase: (id: string) => void;
}) => {
  return (
    <div className="flex">
      <Button
        key={caseData.id}
        variant="secondary-darker"
        className={`flex flex-1 items-center gap-2 ${showToggleFavoriteButton ? "rounded-r-none" : ""} p-2 text-left backdrop-blur-md`}
        playSoundOnClick={false}
        onClick={() => {
          selectCase(caseData.id);
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

      {showToggleFavoriteButton && (
        <Button
          variant="secondary-darker"
          className="rounded-l-none p-2 backdrop-blur-md"
          onClick={() => toggleFavoriteCase(caseData.id)}
        >
          {isFavorite ? (
            <Icons.star className="text-yellow-500" />
          ) : (
            <Icons.hollowStar />
          )}
        </Button>
      )}
    </div>
  );
};
