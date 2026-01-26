// apps/api/src/index.ts
import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors()) // P0 阶段必须开启跨域
  .get("/", () => "Hello Abstract Art!")
  .post(
    "/analyze",
    ({ body }) => {
      // 这里后续接入 AI 逻辑
      console.log("收到文案:", body.content);
      return {
        tags: ["#抽象", "#发疯"],
        score: 9,
      };
    },
    {
      body: t.Object({
        content: t.String(),
      }),
    },
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app; // 极其重要：导出给前端用
