import { z, ZodError } from "zod";
import { items } from "../schema.ts";
import db from "../index.ts";
import { sql } from "drizzle-orm";

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

    const parseResult = z.array(skinSchema).safeParse(
      // Some skins have null rarity, so we ignore them (for now)
      skinsData.filter(
        (x: { rarity: { name: string | null } }) => x.rarity.name,
      ),
    );

    if (!parseResult.success) {
      throw new ZodError(parseResult.error.issues);
    }

    const result = await db
      .insert(items)
      .values(
        parseResult.data.map(skinData => ({
          id: skinData.id,
          name: skinData.name,
          description: skinData.description,
          image: skinData.image,
          rarity: skinData.rarity.name,
          phase: skinData.phase,
        })),
      )
      .returning({
        id: items.id,
        is_inserted: sql<boolean>`(xmax = 0)`.as("is_inserted"), // `xmax = 0` means it's a new insert
      })
      .onConflictDoUpdate({
        target: items.id,
        set: {
          name: sql`EXCLUDED.name`,
          description: sql`EXCLUDED.description`,
          image: sql`EXCLUDED.image`,
          rarity: sql`EXCLUDED.rarity`,
          phase: sql`EXCLUDED.phase`,
        },
      });

    const insertedCount = result.filter(r => r.is_inserted).length;

    console.log(
      `✓ Complete. Inserted ${insertedCount.toLocaleString("en")} new skins.`,
    );
  } catch (error) {
    console.log("insertSkins: Error inserting skins:", error);
  } finally {
    process.exit(0);
  }
}

insertSkins();
