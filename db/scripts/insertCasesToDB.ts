import { z, ZodError } from "zod";
import { cases } from "../schema.ts";
import db from "../index.ts";

const caseSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  description: z.string().nullable(),
});

async function insertCases() {
  const res = await fetch(
    "https://bymykel.github.io/CSGO-API/api/en/crates.json",
  );
  const casesData = await res.json();

  if (!casesData) {
    console.error("No case data found or the fetch failed.");
    return;
  }

  const parsedData = z.array(caseSchema).safeParse(casesData);

  if (!parsedData.success) {
    throw new ZodError(parsedData.error.issues);
  }

  const result = await db
    .insert(cases)
    .values(
      casesData.map((caseData: any) => ({
        id: caseData.id,
        name: caseData.name,
        image: caseData.image,
        description: caseData.description,
      })),
    )
    .onConflictDoNothing();

  console.log(`Inserted ${result.changes} cases.`);
}

insertCases();
