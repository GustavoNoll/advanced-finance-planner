# Guia Rápido: Migração para Monorepo
## Passo a Passo Prático

Este guia assume que você quer implementar a **Opção 1 (Monorepo com Workspaces)** de forma prática e segura.

---

## ⚠️ Antes de Começar

1. **Faça backup** do seu código atual
2. **Crie uma branch** para a migração: `git checkout -b feature/monorepo-migration`
3. **Teste localmente** antes de fazer deploy

---

## 🚀 Passo a Passo

### Passo 1: Criar Estrutura de Pastas (5 min)

```bash
# Na raiz do projeto
mkdir -p packages/frontend packages/backend packages/shared

# Mover arquivos do frontend
mv src packages/frontend/
mv public packages/frontend/
mv index.html packages/frontend/
mv vite.config.ts packages/frontend/
mv tailwind.config.js packages/frontend/
mv postcss.config.js packages/frontend/
mv components.json packages/frontend/
mv tsconfig.app.json packages/frontend/
mv tsconfig.json packages/frontend/tsconfig.frontend.json

# Mover arquivos de configuração compartilhados (se houver)
mv tsconfig.node.json packages/frontend/
```

### Passo 2: Atualizar Root package.json (10 min)

```json
{
  "name": "advanced-finance-planner",
  "private": true,
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=packages/frontend",
    "dev:frontend": "npm run dev --workspace=packages/frontend",
    "dev:backend": "npm run dev --workspace=packages/backend",
    "build": "npm run build --workspace=packages/frontend",
    "build:frontend": "npm run build --workspace=packages/frontend",
    "build:backend": "npm run build --workspace=packages/backend",
    "lint": "npm run lint --workspace=packages/frontend",
    "test": "npm run test --workspace=packages/frontend"
  },
  "devDependencies": {
    "typescript": "^5.5.3"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Passo 3: Criar Frontend package.json (5 min)

**packages/frontend/package.json:**
```json
{
  "name": "@app/frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@app/shared": "*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-query": "^5.56.2",
    "@supabase/supabase-js": "^2.50.0",
    // ... copiar todas as outras dependências do package.json atual
  },
  "devDependencies": {
    "@vitejs/plugin-react-swc": "^3.5.0",
    "vite": "^6.3.4",
    "typescript": "^5.5.3",
    // ... copiar devDependencies do package.json atual
  }
}
```

### Passo 4: Atualizar vite.config.ts (2 min)

**packages/frontend/vite.config.ts:**
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import vercel from 'vite-plugin-vercel';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    vercel(),
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared/src"),
    },
  },
}));
```

### Passo 5: Criar Backend package.json (5 min)

**packages/backend/package.json:**
```json
{
  "name": "@app/backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint ."
  },
  "dependencies": {
    "@app/shared": "*",
    "express": "^5.1.0",
    "@supabase/supabase-js": "^2.50.0",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/express": "^5.0.1",
    "@types/node": "^22.5.5",
    "tsx": "^4.19.3",
    "typescript": "^5.5.3"
  }
}
```

### Passo 6: Criar Shared Package (10 min)

**packages/shared/package.json:**
```json
{
  "name": "@app/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./utils": "./src/utils/index.ts"
  },
  "dependencies": {
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "typescript": "^5.5.3"
  }
}
```

**packages/shared/src/index.ts:**
```typescript
// Exportar tudo que será compartilhado
export * from './types'
export * from './utils'
```

**packages/shared/src/types/index.ts:**
```typescript
// Mover types comuns aqui
export interface User {
  id: string
  name: string
  email: string
}

// Exportar types do frontend que o backend também precisa
export type { InvestmentPlan } from '../../../frontend/src/types/financial/investment-plans'
export type { FinancialRecord } from '../../../frontend/src/types/financial/financial-records'
```

**packages/shared/tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Passo 7: Atualizar Imports no Frontend (15 min)

Substituir imports de types para usar o shared:

```typescript
// Antes
import { InvestmentPlan } from '@/types/financial/investment-plans'

// Depois
import { InvestmentPlan } from '@app/shared/types'
// ou
import type { InvestmentPlan } from '@shared/types'
```

**Script para ajudar (opcional):**
```bash
# Encontrar todos os imports de types
grep -r "from '@/types" packages/frontend/src
```

### Passo 8: Configurar Vercel (10 min)

**Opção A: Um Projeto Vercel (Mais Simples)**

**vercel.json (root):**
```json
{
  "version": 2,
  "buildCommand": "npm run build:frontend",
  "outputDirectory": "packages/frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ],
  "functions": {
    "packages/backend/api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

**Opção B: Dois Projetos Vercel (Recomendado para produção)**

1. **Frontend Project:**
   - Root Directory: `packages/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Framework: Vite

2. **Backend Project:**
   - Root Directory: `packages/backend`
   - Build Command: `npm run build`
   - Framework: Other
   - Functions: `api/**/*.ts`

### Passo 9: Atualizar tsconfig (5 min)

**packages/frontend/tsconfig.json:**
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/src/*"]
    }
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../shared" }
  ]
}
```

**tsconfig.json (root):**
```json
{
  "files": [],
  "references": [
    { "path": "./packages/frontend" },
    { "path": "./packages/backend" },
    { "path": "./packages/shared" }
  ],
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true
  }
}
```

### Passo 10: Instalar Dependências (5 min)

```bash
# Na raiz do projeto
rm -rf node_modules package-lock.json
npm install
```

### Passo 11: Testar Localmente (10 min)

```bash
# Testar frontend
npm run dev:frontend

# Em outro terminal, testar backend (se tiver)
npm run dev:backend
```

### Passo 12: Atualizar .gitignore (2 min)

```gitignore
# Adicionar ao .gitignore
packages/*/node_modules
packages/*/dist
packages/*/.vercel
```

---

## ✅ Checklist de Migração

- [ ] Estrutura de pastas criada
- [ ] Root package.json configurado com workspaces
- [ ] Frontend package.json criado
- [ ] Backend package.json criado
- [ ] Shared package.json criado
- [ ] Imports atualizados
- [ ] Vercel configurado
- [ ] Dependências instaladas
- [ ] Testado localmente
- [ ] Build funciona
- [ ] Deploy testado

---

## 🐛 Problemas Comuns

### Erro: "Cannot find module '@app/shared'"

**Solução:**
```bash
# Reinstalar dependências
rm -rf node_modules packages/*/node_modules
npm install
```

### Erro: "Workspace not found"

**Solução:**
Verificar se `packages/shared/package.json` tem o nome correto: `"name": "@app/shared"`

### Erro no Build do Vercel

**Solução:**
- Verificar se `vercel.json` está na raiz
- Verificar se paths estão corretos
- Verificar variáveis de ambiente

### TypeScript não encontra types do shared

**Solução:**
- Adicionar `references` no tsconfig.json
- Habilitar `composite: true` no tsconfig

---

## 🚀 Próximos Passos Após Migração

1. **Mover mais código para shared** (utils, constants)
2. **Configurar CI/CD** para builds separados
3. **Adicionar testes** para cada package
4. **Documentar** estrutura do monorepo
5. **Otimizar builds** com cache

---

## 📞 Precisa de Ajuda?

Se encontrar problemas:
1. Verificar logs do Vercel
2. Testar localmente primeiro
3. Revisar documentação do Vercel sobre monorepos
4. Verificar se todas as dependências estão instaladas

---

**Tempo estimado total:** 2-3 horas para migração básica

**Última atualização:** Janeiro 2025
