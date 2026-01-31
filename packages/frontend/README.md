# Frontend Package

Aplicação React + Vite do Advanced Finance Planner.

## Estrutura

- `src/` - Código fonte
- `public/` - Assets estáticos
- `index.html` - Entry point HTML

## Desenvolvimento

```bash
# Na raiz do projeto
npm run dev:frontend

# Ou dentro desta pasta
npm run dev
```

## Build

```bash
npm run build:frontend
```

O build será gerado em `dist/`.

## Configuração

- **Vite** - Build tool
- **React 18** - Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Server state
- **React Router** - Navigation

## Imports

```typescript
// Imports locais
import { Component } from '@/components/Component'

// Imports do shared package
import { formatDate } from '@app/shared/utils'
import type { BaseEntity } from '@app/shared/types'
```
