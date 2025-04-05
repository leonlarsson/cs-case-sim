import { Metadata } from "next";
import Image from "next/image";
import casesLocal from "@/lib/data/cases.json";
import souvenirCasesLocal from "@/lib/data/souvenir.json";
import extraCasesLocal from "@/lib/data/extraCases.json";
import { CasePicker } from "@/components/CasePicker";
import { AboutButtonWithModal } from "@/components/AboutButtonWithModal";
import { UnlockButton } from "@/components/UnlockButton";
import { Button } from "@/components/Button";
import { APICase, CasePickerCase } from "@/types";
import { CaseItems } from "@/components/CaseItems";

// Just get the metadata for the cases
// Used in the CasePicker component and for the page title
const casesMetadata: CasePickerCase[] = [
  ...casesLocal.toReversed(),
  ...extraCasesLocal,
  ...souvenirCasesLocal.toReversed(),
].map(x => ({
  id: x.id,
  name: x.name,
  description: x.description,
  image: x.image,
  first_sale_date: x.first_sale_date,
}));

const defaultCaseId = "crate-7007";

type PageProps = {
  searchParams: { case?: string };
};

export const generateMetadata = ({ searchParams }: PageProps): Metadata => {
  const caseName = casesMetadata.find(x => x.id === searchParams.case)?.name;

  return {
    title: caseName
      ? `${caseName} | Counter-Strike Case Simulator`
      : "Counter-Strike Case Simulator",
  };
};

export default async function Home({ searchParams }: PageProps) {
  const { case: selectedCaseParam } = searchParams;

  const casesData: APICase[] = [
    // ...cases,
    ...casesLocal,
    ...extraCasesLocal,
    ...souvenirCasesLocal,
    // ...souvenirPackages,
  ];

  const selectedCase =
    casesData.find(x => x.id === (selectedCaseParam ?? defaultCaseId)) ??
    casesData[0];

  return (
    <main id="main" className="relative flex min-h-screen select-none flex-col">
      {/* Notice message */}
      {selectedCase.id !== defaultCaseId && (
        <Button
          variant="secondary-darker"
          href={`/?case=${defaultCaseId}`}
          className="mx-2 mt-1 flex w-fit items-center gap-2 py-1 backdrop-blur-md"
        >
          Try the new Fever Case
          <Image
            src="https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapon_cases/crate_community_35_png.png"
            alt="Fever Case"
            width={256 / 7}
            height={198 / 7}
          />
        </Button>
      )}

      {/* Header row */}
      <div className="mx-2 mt-2 flex flex-col-reverse justify-between gap-2 min-[800px]:flex-row">
        <CasePicker availableCases={casesMetadata} />

        <Button
          variant="secondary-darker"
          href="/unboxed"
          className="flex items-center justify-center py-0 text-center backdrop-blur-md"
        >
          Global Unbox History
        </Button>
      </div>

      {/* Case display */}
      <div className="mt-3 flex flex-1 flex-col items-center gap-1 text-center">
        <h1 className="text-4xl font-medium text-white">Unlock Container</h1>
        <h4 className="text-xl">
          Unlock <span className="font-semibold">{selectedCase.name}</span>
          <span className="hidden max-[500px]:inline [@media_(max-height:500px)]:inline">
            {" "}
            <img
              className="inline"
              src={selectedCase.image}
              alt={`${selectedCase.name} image`}
              width={48}
              draggable={false}
            />
          </span>
        </h4>

        <img
          className="block max-[500px]:hidden [@media_(max-height:500px)]:hidden"
          src={selectedCase.image}
          alt={`${selectedCase.name} image`}
          width={256 / 1.7}
          height={256 / 1.7}
          draggable={false}
        />
      </div>

      {/* Item display */}
      <div className="flex flex-col backdrop-blur-md">
        <div className="my-2 px-4 lg:px-12">
          <div className="relative flex items-center justify-between">
            <div></div>

            <span className="absolute left-1/2 -translate-x-1/2 transform text-center text-lg tracking-wider">
              Open and receive one of the following
            </span>

            <AboutButtonWithModal />
          </div>

          <hr className="my-2 opacity-30" />
        </div>

        <div className="flex max-h-96 flex-wrap gap-8 overflow-auto px-4 pb-2 max-[500px]:flex-nowrap min-[800px]:px-16 [@media_(max-height:500px)]:flex-nowrap [@media_(max-height:500px)]:px-8">
          <CaseItems caseData={selectedCase} />
        </div>

        <hr className="container mx-auto my-5 px-20 opacity-30" />

        <div className="container mx-auto mb-6 flex items-center justify-between px-3">
          <span className="text-2xl tracking-wider">
            <span className="hidden md:inline">
              {!selectedCase.name.toLowerCase().includes("package") ? (
                <span>
                  Use <span className="font-bold">{selectedCase.name} Key</span>
                </span>
              ) : null}
            </span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <UnlockButton caseId={selectedCase.id} />

            <div className="mx-2 hidden h-16 w-px bg-white/50 md:inline" />

            <Button
              variant="secondary"
              className="hidden cursor-not-allowed md:inline"
              playSoundOnClick={false}
            >
              CLOSE
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
