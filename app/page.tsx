import { Metadata } from "next";
import Image from "next/image";
import casesLocal from "@/lib/data/cases.json";
import souvenirCasesLocal from "@/lib/data/souvenir.json";
import customCasesLocal from "@/lib/data/customCases.json";
import CasePicker from "@/components/CasePicker";
import AboutButtonWithModal from "@/components/AboutButtonWithModal";
import UnlockButton from "@/components/UnlockButton";
import Button from "@/components/Button";
import { APICase, CasePickerCase } from "@/types";
import CaseItems from "@/components/CaseItems";

// Just get the metadata for the cases
// Used in the CasePicker component and for the page title
const casesMetadata: CasePickerCase[] = [
  ...casesLocal.toReversed(),
  ...customCasesLocal,
  ...souvenirCasesLocal.toReversed(),
].map(x => ({
  id: x.id,
  name: x.name,
  description: x.description,
  image: x.image,
  first_sale_date: x.first_sale_date,
}));

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

  // The API made even more changes. If I use the API again, I will need to filter out certain types
  // For now, I will just use the local data and update it manually
  // const apis: { url: string; revalidateSeconds: number }[] = [
  //   {
  //     url: "https://bymykel.github.io/CSGO-API/api/en/crates/cases.json",
  //     revalidateSeconds: 3600,
  //   },
  //   {
  //     url: "https://bymykel.github.io/CSGO-API/api/en/crates/souvenir.json",
  //     revalidateSeconds: 3600,
  //   },
  // ];

  // const promises = apis.map(api =>
  //   fetch(api.url, {
  //     next: { revalidate: api.revalidateSeconds },
  //   }).then(res => res.json()),
  // );

  // const [cases, souvenirPackages] = await Promise.all(promises);

  // Combine the case data arrays
  // This is not visual at all, so the order doesn't matter
  // The only place where the order matters is in the CasePicker component, which uses the casesMetadata array above
  const casesData: APICase[] = [
    // ...cases,
    ...casesLocal,
    ...customCasesLocal,
    ...souvenirCasesLocal,
    // ...souvenirPackages,
  ];

  const selectedCase =
    casesData.find(x => x.id === (selectedCaseParam ?? "crate-7003")) ??
    casesData[0];

  return (
    <main id="main" className="relative flex min-h-screen select-none flex-col">
      {/* Notice message */}
      {selectedCase.id !== "crate-7003" && (
        <Button
          variant="secondary-darker"
          href="/?case=crate-7003"
          className="mx-2 mt-1 flex w-fit items-center gap-2 py-1 backdrop-blur-md"
        >
          Try the new Gallery Case
          <Image
            src="https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/weapon_cases/crate_community_34_png.png"
            alt="Gallery Case"
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
        </h4>

        <img
          src={selectedCase.image}
          alt={`${selectedCase.name} image`}
          width={256}
          height={256}
          draggable={false}
        />
      </div>

      {/* Item display */}
      <div className="flex flex-col backdrop-blur-md">
        <div className="my-2 px-4 lg:px-12">
          <div className="flex items-center justify-between">
            <span className="text-lg tracking-wider">
              Contains one of the following:
            </span>

            <div className="flex gap-1">
              <Button href="/unboxed" variant="secondary-darker">
                INSPECT ITEMS
              </Button>
              <AboutButtonWithModal />
            </div>
          </div>
          <hr className="my-2 opacity-30" />
        </div>

        <div className="flex max-h-96 flex-wrap justify-center gap-8 overflow-auto px-2 lg:justify-start lg:px-16">
          <CaseItems
            items={selectedCase.contains}
            rareItems={selectedCase.contains_rare}
          />
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

            <div className="mx-2 h-16 w-px bg-white/50" />

            <Button
              variant="secondary"
              className="cursor-not-allowed"
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
