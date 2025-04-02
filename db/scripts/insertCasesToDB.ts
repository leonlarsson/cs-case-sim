import { z, ZodError } from "zod";
import { cases } from "../schema.ts";
import db from "../index.ts";
import { sql } from "drizzle-orm";

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

    const parseResult = z.array(caseSchema).safeParse(casesData);

    if (!parseResult.success) {
      throw new ZodError(parseResult.error.issues);
    }

    const result = await db
      .insert(cases)
      .values(
        parseResult.data.map(caseData => ({
          id: caseData.id,
          type: caseData.type,
          name: caseData.name,
          image: caseData.image,
          description: caseData.description,
        })),
      )
      .returning({
        id: cases.id,
        is_inserted: sql<boolean>`(xmax = 0)`.as("is_inserted"), // `xmax = 0` means it's a new insert
      })
      .onConflictDoUpdate({
        target: cases.id,
        set: {
          type: sql`EXCLUDED.type`,
          name: sql`EXCLUDED.name`,
          description: sql`EXCLUDED.description`,
          image: sql`EXCLUDED.image`,
        },
      });

    const insertedCount = result.filter(item => item.is_inserted).length;

    console.log(
      `✓ Complete. Inserted ${insertedCount.toLocaleString("en")} new cases.`,
    );
  } catch (error) {
    console.log("insertCases: Error inserting cases:", error);
  } finally {
    process.exit(0);
  }
}

insertCases();
