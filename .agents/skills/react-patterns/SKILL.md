---
name: react-patterns
description: Apply React, Vite, and Tailwind best practices. Use when creating components, hooks, pages, or API calls in the advanced-finance-planner frontend.
---

# React Patterns

## Stack

- React 18 + Vite
- Tailwind CSS
- react-i18next
- TanStack Query
- React Router

## Components

- **kebab-case.tsx** for file names
- Functional components: `export function ComponentName()`
- Minimize `'use client'` to small, isolated parts when needed
- Use semantic HTML

## Data Fetching

- Use TanStack Query (`useQuery`, `useMutation`) for API calls
- Add loading and error states
- Colocate data logic in hooks under `features/[name]/hooks/`

## Styling

- Tailwind CSS classes
- shadcn/ui components in `@/components/ui`
- Responsive design

## Structure

- Features: `src/features/[name]/` with components, hooks, services, types
- Shared: `src/shared/components/`
- Path aliases: `@/components`, `@/features`, `@/utils`, etc.

## Error Handling

- Implement error boundaries where appropriate
- User-friendly messages via i18n
- Toast/sonner for notifications

## References

- `docs/CONVENCOES_CODIGO.md`
- `docs/ESTRUTURA_PROJETO.md`
