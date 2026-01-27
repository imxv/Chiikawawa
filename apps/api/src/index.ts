// apps/api/src/index.ts
import { config } from "dotenv";
config({ path: "../../.env" });

import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import { posts, tags, postTags } from "./db/schema";

async function selectRandomTags(count: number): Promise<string[]> {
  const result = await db.select({ name: tags.name }).from(tags).orderBy(sql`RANDOM()`).limit(count);
  return result.map(row => row.name);
}

async function analyzeContent(_content: string) {
  const count = Math.floor(Math.random() * 3) + 2;
  const selectedTags = await selectRandomTags(count);
  return {
    tags: selectedTags,
    score: Math.floor(Math.random() * 3) + 8,
  };
}

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Abstract Art!")
  .get("/posts", async () => {
    try {
      const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
      if (allPosts.length === 0) return [];

      const postIds = allPosts.map(p => p.id);
      const tagRelations = await db
        .select({ postId: postTags.postId, tagName: tags.name })
        .from(postTags)
        .innerJoin(tags, eq(postTags.tagId, tags.id))
        .where(inArray(postTags.postId, postIds));

      const tagsByPostId = new Map<string, string[]>();
      for (const rel of tagRelations) {
        const existing = tagsByPostId.get(rel.postId) ?? [];
        existing.push(rel.tagName);
        tagsByPostId.set(rel.postId, existing);
      }

      return allPosts.map(post => ({
        ...post,
        tags: tagsByPostId.get(post.id) ?? [],
      }));
    } catch (e) {
      console.error("GET /posts error:", e);
      throw e;
    }
  })
  .post(
    "/posts",
    async ({ body }) => {
      try {
        const { tags: tagNames, score } = await analyzeContent(body.content);
        const [post] = await db.insert(posts).values({
          content: body.content,
          score,
        }).returning();

        if (tagNames.length > 0) {
          const tagRecords = await db
            .select({ id: tags.id, name: tags.name })
            .from(tags)
            .where(inArray(tags.name, tagNames));

          if (tagRecords.length > 0) {
            await db.insert(postTags).values(
              tagRecords.map(tag => ({ postId: post.id, tagId: tag.id }))
            );
          }

          return { ...post, tags: tagRecords.map(r => r.name) };
        }

        return { ...post, tags: [] };
      } catch (e) {
        console.error("POST /posts error:", e);
        throw e;
      }
    },
    { body: t.Object({ content: t.String() }) },
  )
  .post(
    "/analyze",
    async ({ body }) => analyzeContent(body.content),
    { body: t.Object({ content: t.String() }) },
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app; // 极其重要：导出给前端用
