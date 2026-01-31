# Packages

Este diretório contém os packages do monorepo.

## Estrutura

- **frontend/** - Aplicação React + Vite
- **backend/** - API Express.js (Serverless Functions)
- **shared/** - Código compartilhado (types, utils)

## Desenvolvimento

### Instalar dependências
```bash
# Na raiz do projeto
npm install
```

### Rodar frontend
```bash
npm run dev:frontend
# ou
npm run dev
```

### Rodar backend
```bash
npm run dev:backend
```

### Build
```bash
npm run build:frontend
npm run build:backend
```

## Workspaces

Este projeto usa npm workspaces para gerenciar os packages. Cada package pode ter suas próprias dependências, mas compartilha o mesmo `node_modules` na raiz.

## Compartilhamento de Código

Use o package `@app/shared` para compartilhar código entre frontend e backend:

```typescript
// No frontend ou backend
import { formatDate } from '@app/shared/utils'
import type { BaseEntity } from '@app/shared/types'
```
