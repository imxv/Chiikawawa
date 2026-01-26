# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chiikawawa is a Bun monorepo with two workspaces:
- **apps/api**: Elysia backend server (port 3000)
- **apps/web**: React frontend with Vite (rolldown-vite)

## Commands

```bash
# Install dependencies
bun install

# Development (both services)
bun run dev

# Development (individual)
bun run dev:api    # API with hot reload
bun run dev:web    # Web with Vite dev server

# Web only
cd apps/web
bun run build      # TypeScript check + Vite build
bun run lint       # ESLint
bun run preview    # Preview production build
```

## Architecture

### Type-Safe API Communication
The frontend uses Elysia Eden to achieve end-to-end type safety with the backend:

1. Backend exports its app type: `export type App = typeof app;` (apps/api/src/index.ts:30)
2. Frontend imports this type directly: `import type { App } from "../../../api/src/index";` (apps/web/src/lib/api.ts:3)
3. Eden client provides typed API calls: `api.analyze.post({ content })` with full autocomplete

### Tech Stack
- **Runtime**: Bun
- **Backend**: Elysia with CORS plugin
- **Frontend**: React 19, TanStack Query, TanStack Router
- **Build**: rolldown-vite (Vite replacement)
- **Type System**: Strict TypeScript with `noUncheckedIndexedAccess`
