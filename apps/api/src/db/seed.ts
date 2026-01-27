import { config } from "dotenv";
config({ path: "../../.env" });

const defaultTags = [
  "#抽象",
  "#发疯",
  "#精神状态",
  "#emo",
  "#人间清醒",
  "#嘴替",
  "#社死",
  "#i人",
  "#e人",
];

async function seed() {
  const { db } = await import("./index");
  const { tags } = await import("./schema");

  console.log("Seeding tags...");

  await db
    .insert(tags)
    .values(defaultTags.map(name => ({ name })))
    .onConflictDoNothing({ target: tags.name });

  console.log(`Seeded ${defaultTags.length} tags.`);
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
