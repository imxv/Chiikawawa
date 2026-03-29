# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chiikawawa is a React frontend project, using Supabase as the backend (BaaS).
- **apps/web**: React frontend with Vite (rolldown-vite)
- **Database**: Supabase (PostgreSQL)

## Commands

```bash
# Install dependencies
bun install

# Development
bun run dev        # Web with Vite dev server

# Web only
cd apps/web
bun run build      # TypeScript check + Vite build
bun run lint       # ESLint
bun run preview    # Preview production build
```

## Architecture

### Data Access
The frontend uses `@supabase/supabase-js` to directly access Supabase:

1. Supabase client: `apps/web/src/lib/supabase.ts`
2. Database types: `apps/web/src/lib/database.types.ts`
3. React Query hooks: `apps/web/src/hooks/usePosts.ts`

### Tech Stack
- **Runtime**: Bun
- **Frontend**: React 19, TanStack Query
- **Backend**: Supabase (PostgreSQL, RLS)
- **Build**: rolldown-vite (Vite replacement)
- **Styling**: Tailwind CSS v4
- **Type System**: Strict TypeScript with `noUncheckedIndexedAccess`

### Environment Variables
Frontend env vars (in `apps/web/.env`):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key


# 注意

1. 严格按照 CLAUDE.md 中的指令进行开发
2. 样式中不要使用蓝紫色渐变色
3. 样式统一使用 TailwindCSS 来实现
