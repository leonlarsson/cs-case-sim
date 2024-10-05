import { z, ZodError } from "zod";
import { items } from "../schema.ts";
import db from "../index.ts";

const skinSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  rarity: z.object({
    name: z.string(),
  }),
  phase: z.string().optional(),
});

async function insertSkins() {
  try {
    const res = await fetch(
      "https://bymykel.github.io/CSGO-API/api/en/skins.json",
    );
    const skinsData = await res.json();

    if (!skinsData) {
      console.error("No skin data found or the fetch failed.");
      return;
    }

    const parsedData = z.array(skinSchema).safeParse(skinsData);

    if (!parsedData.success) {
      throw new ZodError(parsedData.error.issues);
    }

    const result = await db
      .insert(items)
      .values(
        parsedData.data.map(skinData => ({
          id: skinData.id,
          name: skinData.name,
          description: skinData.description,
          image: skinData.image,
          rarity: skinData.rarity.name,
          phase: skinData.phase,
        })),
      )
      .returning({ id: items.id })
      .onConflictDoNothing();

    console.log(`Inserted ${result.length} items.`);
  } catch (error) {
    console.log("insertItems: Error inserting items:", error);
  } finally {
    process.exit(0);
  }
}

insertSkins();
