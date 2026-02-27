---
name: project-structure
description: Organize code following feature-based structure. Use when adding features, migrating code, or structuring components, hooks, services for auth, financial-records, investment-plans, or portfolio-performance.
---

# Project Structure

## Monorepo Layout

```
packages/
├── frontend/     # React + Vite
├── backend/      # Serverless (Vercel)
└── shared/       # Shared types, utils, config
```

## Feature-Based Organization

Each feature in `packages/frontend/src/features/[name]/`:

```
feature-name/
├── components/   # Feature-specific components
├── hooks/        # Custom hooks
├── services/     # Business logic
├── types/        # Feature types
└── index.ts      # Public exports
```

Current features: `auth`, `financial-records`, `investment-plans`, `portfolio-performance`.

## Shared Code

- `@/features/[name]/...` - Feature code
- `shared/components/`, `shared/hooks/`, `shared/utils/` - Cross-feature code
- `packages/shared/src/` - Frontend + backend shared

## Backend API Pattern

- `api/nome-endpoint.ts` → `src/controllers/nome.controller.ts`
- Endpoint file delegates to controller

## Checklist

- [ ] Feature has components/, hooks/, services/, types/, index.ts
- [ ] Imports use `@/features/[name]/...`
- [ ] index.ts exports only public API
- [ ] Folders: kebab-case; Files: kebab-case
