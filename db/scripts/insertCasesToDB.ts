import { z, ZodError } from "zod";
import { cases } from "../schema.ts";
import db from "../index.ts";

const caseSchema = z.object({
  id: z.string(),
  type: z.string().nullable(),
  name: z.string(),
  image: z.string(),
  description: z.string().nullable(),
});

async function insertCases() {
  try {
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
        parsedData.data.map(caseData => ({
          id: caseData.id,
          type: caseData.type,
          name: caseData.name,
          image: caseData.image,
          description: caseData.description,
        })),
      )
      .returning({ id: cases.id })
      .onConflictDoNothing();

    console.log(`Inserted ${result.length} cases.`);
  } catch (error) {
    console.log("insertCases: Error inserting cases:", error);
  } finally {
    process.exit(0);
  }
}

insertCases();
