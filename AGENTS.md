# AGENTS.md

## General rules

- Write clean, readable TypeScript code
- Use functional components and hooks in React
- **Server Components by default** -- only add `'use client'` when strictly necessary (event handlers, state, effects, browser APIs)
- **Server Actions for all mutations** -- never call the database or external APIs from client components
- **TREFLE API is server-only** -- called exclusively from server actions, never exposed in browser network tab
- All text in the UI must be in Dutch
- No emojis in the codebase
- Write short commit messages

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema to SQLite |
| `npx prisma studio` | Open Prisma Studio GUI |

## Conventions

- File names: kebab-case
- Component names: PascalCase
- Function names: camelCase
- Types/interfaces: PascalCase
- Database fields: camelCase
- Server actions return `{ success: boolean, data?: T, error?: string }`
- Use Prisma client singleton (`lib/prisma.ts`) for server-side DB access
- Plant data from TREFLE API is cached locally in the database
- No client-side `fetch` to external APIs -- all external calls go through server actions

## Architecture rules

- Pages are server components that load data and pass it to client components as props
- Client components can call server actions but cannot access the database or external APIs directly
- When a mutation happens, use `revalidatePath` or `revalidateTag` to refresh server-rendered data
- The garden editor canvas is the main exception: it must be a client component due to mouse/touch events
- Plant search is a server action called from the client -- results flow back as props

## Design

Follow the Organic design system from `.skills/design.md`. Use shadcn/ui components with custom theme tokens matching the Organic palette.
