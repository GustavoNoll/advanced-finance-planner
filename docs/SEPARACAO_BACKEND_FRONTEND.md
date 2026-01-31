# Estratégias de Separação Backend/Frontend
## Advanced Finance Planner - Arquitetura Vercel

**Situação Atual:**
- Frontend: React + Vite (SPA)
- Backend: Express.js (Serverless Functions na Vercel)
- Deploy: Tudo no mesmo projeto Vercel
- Database: Supabase

---

## 🎯 Objetivos da Separação

1. **Escalabilidade Independente** - Escalar frontend e backend separadamente
2. **Deploy Independente** - Deploy de um sem afetar o outro
3. **Equipes Independentes** - Equipes podem trabalhar em paralelo
4. **Custos Otimizados** - Pagar apenas pelo que usa
5. **Manutenibilidade** - Código mais organizado e fácil de manter

---

## 📊 Opções de Arquitetura

### Opção 1: Monorepo com Workspaces (Recomendada) ⭐

**Estrutura:**
```
advanced-finance-planner/
├── packages/
│   ├── frontend/          # React + Vite
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── backend/           # Express.js API
│   │   ├── src/
│   │   ├── api/          # Vercel Serverless Functions
│   │   ├── package.json
│   │   └── vercel.json
│   └── shared/           # Código compartilhado
│       ├── types/
│       ├── utils/
│       └── package.json
├── package.json          # Root workspace
└── turbo.json           # Turborepo config (opcional)
```

**Vantagens:**
- ✅ Mantém tudo junto (fácil de gerenciar)
- ✅ Compartilha código via `shared` package
- ✅ Deploy independente na Vercel
- ✅ TypeScript compartilhado
- ✅ CI/CD unificado mas com builds separados

**Desvantagens:**
- ⚠️ Setup inicial requer configuração
- ⚠️ Precisa gerenciar workspaces

**Dificuldade:** 🟡 Média (2-3 dias)

**Como funciona na Vercel:**
- Frontend: Deploy como SPA (configuração atual)
- Backend: Deploy como Serverless Functions em `/api`
- Cada um tem seu próprio `vercel.json` ou configuração no dashboard

---

### Opção 2: Repositórios Separados

**Estrutura:**
```
advanced-finance-planner-frontend/
├── src/
├── package.json
└── vercel.json

advanced-finance-planner-backend/
├── api/
├── src/
├── package.json
└── vercel.json
```

**Vantagens:**
- ✅ Separação total
- ✅ Permissões de acesso diferentes
- ✅ Deploy completamente independente
- ✅ Escalabilidade máxima

**Desvantagens:**
- ⚠️ Código compartilhado precisa ser publicado como package
- ⚠️ Mais complexo de gerenciar
- ⚠️ CI/CD separado

**Dificuldade:** 🔴 Alta (5-7 dias)

**Como funciona na Vercel:**
- Dois projetos Vercel separados
- Cada um com seu próprio domínio/subdomínio
- CORS configurado entre eles

---

### Opção 3: Vercel Monorepo (Mais Simples)

**Estrutura:**
```
advanced-finance-planner/
├── frontend/             # React + Vite
│   ├── src/
│   └── package.json
├── backend/             # Express.js
│   ├── api/
│   └── package.json
├── package.json
└── vercel.json          # Configuração root
```

**Vantagens:**
- ✅ Mais simples que monorepo completo
- ✅ Mantém tudo junto
- ✅ Deploy na Vercel é nativo

**Desvantagens:**
- ⚠️ Menos flexível que monorepo com workspaces
- ⚠️ Compartilhar código é mais manual

**Dificuldade:** 🟢 Baixa (1-2 dias)

**Como funciona na Vercel:**
- Vercel detecta automaticamente múltiplos apps
- Configuração via `vercel.json` na root
- Deploy de cada app separadamente

---

## 🚀 Implementação Recomendada: Opção 1 (Monorepo)

### Passo a Passo

#### 1. Reestruturar Projeto

```bash
# Criar estrutura de monorepo
mkdir -p packages/frontend packages/backend packages/shared

# Mover código atual
mv src packages/frontend/
mv public packages/frontend/
mv index.html packages/frontend/
mv vite.config.ts packages/frontend/
mv tailwind.config.js packages/frontend/
mv postcss.config.js packages/frontend/
mv components.json packages/frontend/

# Criar estrutura backend (se não existir)
mkdir -p packages/backend/api
```

#### 2. Configurar Workspaces (Root package.json)

```json
{
  "name": "advanced-finance-planner",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "frontend:dev": "npm run dev --workspace=packages/frontend",
    "backend:dev": "npm run dev --workspace=packages/backend",
    "frontend:build": "npm run build --workspace=packages/frontend",
    "backend:build": "npm run build --workspace=packages/backend"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.5.3"
  }
}
```

#### 3. Frontend Package.json

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
    "lint": "eslint ."
  },
  "dependencies": {
    "@app/shared": "*",
    "react": "^18.3.1",
    // ... outras deps do frontend
  }
}
```

#### 4. Backend Package.json

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
    // ... outras deps do backend
  }
}
```

#### 5. Shared Package.json

```json
{
  "name": "@app/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    "./types": "./src/types/index.ts",
    "./utils": "./src/utils/index.ts"
  }
}
```

#### 6. Configurar Vercel

**vercel.json (Root):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "packages/frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "packages/backend/api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "packages/backend/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "packages/frontend/$1"
    }
  ]
}
```

**Ou usar Vercel Dashboard:**
- Criar dois projetos Vercel
- Frontend: apontar para `packages/frontend`
- Backend: apontar para `packages/backend`

#### 7. Configurar Turborepo (Opcional mas Recomendado)

**turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

---

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente

**Frontend (.env.local):**
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://api.seudominio.com
```

**Backend (.env.local):**
```env
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
DATABASE_URL=...
NODE_ENV=production
```

**Vercel:**
- Configurar variáveis no dashboard
- Frontend: Prefixo `VITE_`
- Backend: Sem prefixo

---

## 📦 Compartilhamento de Código

### Types Compartilhados

**packages/shared/src/types/index.ts:**
```typescript
export interface User {
  id: string
  name: string
  email: string
}

export interface InvestmentPlan {
  id: string
  // ...
}
```

**Uso no Frontend:**
```typescript
import type { User, InvestmentPlan } from '@app/shared/types'
```

**Uso no Backend:**
```typescript
import type { User, InvestmentPlan } from '@app/shared/types'
```

### Utils Compartilhados

**packages/shared/src/utils/validation.ts:**
```typescript
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})
```

---

## 🔄 Migração Gradual

### Fase 1: Preparação (1 semana)
- [ ] Criar estrutura de monorepo
- [ ] Mover código frontend
- [ ] Mover código backend
- [ ] Configurar workspaces

### Fase 2: Compartilhamento (1 semana)
- [ ] Criar package shared
- [ ] Mover types para shared
- [ ] Mover utils comuns
- [ ] Atualizar imports

### Fase 3: Deploy (1 semana)
- [ ] Configurar Vercel para monorepo
- [ ] Testar deploy frontend
- [ ] Testar deploy backend
- [ ] Configurar CI/CD

### Fase 4: Otimização (contínuo)
- [ ] Otimizar builds
- [ ] Adicionar cache
- [ ] Monitorar performance

---

## 🎯 Comparação de Dificuldade

| Opção | Dificuldade | Tempo | Complexidade |
|-------|------------|-------|--------------|
| Monorepo Workspaces | 🟡 Média | 2-3 dias | Média |
| Repositórios Separados | 🔴 Alta | 5-7 dias | Alta |
| Vercel Monorepo | 🟢 Baixa | 1-2 dias | Baixa |

---

## 💡 Recomendação Final

**Para seu caso, recomendo: Opção 1 (Monorepo com Workspaces)**

**Por quê?**
1. ✅ Mantém histórico Git
2. ✅ Facilita compartilhar código
3. ✅ Deploy independente na Vercel
4. ✅ Escalável para crescimento futuro
5. ✅ Não é muito difícil (2-3 dias de trabalho)

**Alternativa Rápida:**
Se precisar de algo mais rápido, use **Opção 3 (Vercel Monorepo)** - é mais simples e você pode migrar depois.

---

## 📚 Recursos

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [NPM Workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)

---

## ❓ FAQ

**P: Preciso mudar tudo de uma vez?**  
R: Não! Pode fazer migração gradual, mantendo tudo funcionando.

**P: Vai quebrar o deploy atual?**  
R: Não, se fizer gradualmente. Teste em branch separada primeiro.

**P: E se eu quiser separar depois?**  
R: Monorepo facilita separar depois em repositórios diferentes.

**P: Custa mais na Vercel?**  
R: Não, você paga pelo uso (functions + bandwidth), não pela estrutura.

**P: Posso testar localmente?**  
R: Sim! Com workspaces, `npm run dev` roda tudo junto.

---

**Última atualização:** Janeiro 2025
