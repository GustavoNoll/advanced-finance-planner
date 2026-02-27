---
name: code-conventions
description: Apply project coding standards for naming, file structure, imports, TypeScript, and React. Use when creating or modifying components, hooks, services, or types in the advanced-finance-planner project.
---

# Code Conventions

## Naming

| Type | File | Export |
|------|------|--------|
| Components | `kebab-case.tsx` | `PascalCase` |
| Hooks | `use-kebab-case.ts` | `camelCase` |
| Services | `kebab-case.service.ts` | `PascalCase` |
| Types | `kebab-case.ts` | `PascalCase` |
| Utils | `kebab-case.ts` | `camelCase` |
| Props | — | `ComponentNameProps` |

## Imports Order

1. External (React, libraries)
2. Internal shared (`@/components`, `@/utils`)
3. Feature-specific (`@/features/[name]/...`)
4. Types/Interfaces
5. Component/Hook/Function

Use path aliases (`@/`) instead of deep relative paths.

## TypeScript

- Explicit types on function params and returns
- Interface for objects, props, classes
- Type for unions, intersections, mapped types
- Avoid `any`; use `unknown` when necessary

## React

- Functional components: `export function ComponentName()`
- Props: destructure with explicit interface
- Hooks: return named object `{ user, loading, error }`
- Event handlers: type with `React.MouseEvent<HTMLButtonElement>` or omit if not needed

## References

- `docs/CONVENCOES_CODIGO.md` - Full conventions
- `docs/ESTRUTURA_PROJETO.md` - Project structure
