// apps/api/src/index.ts
import { config } from "dotenv";
config({ path: "../../.env" });

import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { desc } from "drizzle-orm";
import { db } from "./db";
import { posts } from "./db/schema";

function analyzeContent(_content: string) {
  const tagPool = ["#抽象", "#发疯", "#精神状态", "#emo", "#人间清醒", "#嘴替", "#社死", "#i人", "#e人"];
  const count = Math.floor(Math.random() * 3) + 2;
  const shuffled = tagPool.sort(() => 0.5 - Math.random());
  return {
    tags: shuffled.slice(0, count),
    score: Math.floor(Math.random() * 3) + 8,
  };
}

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Abstract Art!")
  .get("/posts", async () => {
    try {
      return await db.select().from(posts).orderBy(desc(posts.createdAt));
    } catch (e) {
      console.error("GET /posts error:", e);
      throw e;
    }
  })
  .post(
    "/posts",
    async ({ body }) => {
      try {
        const { tags, score } = analyzeContent(body.content);
        const [post] = await db.insert(posts).values({
          content: body.content,
          tags,
          score,
        }).returning();
        return post;
      } catch (e) {
        console.error("POST /posts error:", e);
        throw e;
      }
    },
    { body: t.Object({ content: t.String() }) },
  )
  .post(
    "/analyze",
    ({ body }) => analyzeContent(body.content),
    { body: t.Object({ content: t.String() }) },
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app; // 极其重要：导出给前端用
