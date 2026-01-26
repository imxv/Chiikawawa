// apps/web/src/lib/api.ts
import { edenTreaty } from "@elysiajs/eden";
import type { App } from "../../../api/src/index"; // 直接跨文件夹引入后端类型

// 后端地址，P0 阶段先硬编码
export const api = edenTreaty<App>("http://localhost:3000");
