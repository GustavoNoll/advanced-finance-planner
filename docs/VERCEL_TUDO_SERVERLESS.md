# Configuração Vercel - Frontend + Backend Serverless
## Tudo em um Projeto Vercel

---

## 🎯 Arquitetura

```
Vercel (1 projeto)
├── Frontend (SPA)
│   └── packages/frontend/
│       └── dist/ → Deploy
└── Backend (Serverless Functions)
    └── api/ → Funções automáticas
        ├── health.ts
        ├── test.ts
        └── ...
```

**Vantagens:**
- ✅ Tudo em um lugar só
- ✅ Deploy unificado
- ✅ Variáveis de ambiente compartilhadas
- ✅ Domínio único
- ✅ Mais simples de gerenciar
- ✅ Custo otimizado (só Vercel)

---

## 📋 Configuração

### 1. Estrutura de Arquivos

```
advanced-finance-planner/
├── api/                          # Serverless Functions (gerado automaticamente)
│   ├── health.ts
│   └── test.ts
├── packages/
│   ├── frontend/
│   │   ├── src/
│   │   ├── dist/                 # Build output
│   │   └── vercel.json
│   └── backend/
│       ├── api/                  # Source das funções
│       │   ├── health.ts
│       │   └── test.ts
│       └── src/
│           └── index.ts          # Para desenvolvimento local
├── scripts/
│   └── sync-api-functions.sh     # Sincroniza funções para api/
├── vercel.json                   # Configuração principal
└── package.json
```

### 2. vercel.json (Raiz)

```json
{
  "version": 2,
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "packages/frontend/dist",
  "framework": "vite",
  "installCommand": "npm install",
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
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Credentials",
          "value": "true"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
        }
      ]
    }
  ]
}
```

### 3. package.json (Raiz)

```json
{
  "scripts": {
    "vercel-build": "npm run sync-api && npm run build --workspace=packages/frontend",
    "sync-api": "bash scripts/sync-api-functions.sh"
  }
}
```

### 4. scripts/sync-api-functions.sh

```bash
#!/bin/bash

echo "🔄 Sincronizando funções do backend para api/..."

# Criar o diretório api/ na raiz se não existir
mkdir -p api

# Copiar todos os arquivos .ts da pasta packages/backend/api para a pasta api/ na raiz
cp packages/backend/api/*.ts api/

echo "✅ Funções sincronizadas!"
echo "📁 Funções disponíveis em:"
ls -la api/
```

### 5. .gitignore

Adicione:
```
# Vercel Serverless Functions (gerado automaticamente)
api/
```

---

## 🚀 Como Funciona

### Build Process

1. **Vercel executa:** `npm run vercel-build`
2. **Script sincroniza:** Copia `packages/backend/api/*.ts` → `api/`
3. **Vercel detecta:** Funções em `api/` automaticamente
4. **Frontend build:** `npm run build` em `packages/frontend`
5. **Deploy:** Frontend + Serverless Functions

### Rotas

- **Frontend:** `https://app.seudominio.com/`
- **API Health:** `https://app.seudominio.com/api/health`
- **API Test:** `https://app.seudominio.com/api/test`

---

## ⚙️ Configuração no Dashboard Vercel

### Settings → General

- **Root Directory:** Deixe vazio (raiz do projeto)
- **Framework Preset:** Vite (ou detectar automaticamente)

### Settings → Build & Development Settings

- **Build Command:** `npm run vercel-build`
- **Output Directory:** `packages/frontend/dist`
- **Install Command:** `npm install`

### Settings → Environment Variables

Adicione todas as variáveis necessárias:
```
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
FRONTEND_URL=https://app.seudominio.com
NODE_ENV=production
```

---

## 📝 Criar Nova Serverless Function

### 1. Criar arquivo em `packages/backend/api/`

**packages/backend/api/users.ts:**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  const frontendUrl = process.env.FRONTEND_URL || '*'
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', frontendUrl)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    return res.json({ 
      message: 'Users endpoint',
      data: []
    })
  }

  return res.status(405).json({ 
    error: 'Method not allowed'
  })
}
```

### 2. Função será sincronizada automaticamente

O script `sync-api-functions.sh` copia automaticamente para `api/` durante o build.

### 3. Acessar

- URL: `https://app.seudominio.com/api/users`

---

## 🔧 Desenvolvimento Local

### Frontend

```bash
npm run dev:frontend
# http://localhost:8080
```

### Backend (Express local)

```bash
npm run dev:backend
# http://localhost:8081
```

### Backend (Serverless Functions local)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Rodar localmente
vercel dev
```

---

## 📊 Estrutura de URLs

### Produção (Vercel)

```
https://app.seudominio.com/              → Frontend (SPA)
https://app.seudominio.com/api/health     → Serverless Function
https://app.seudominio.com/api/test       → Serverless Function
https://app.seudominio.com/api/users      → Serverless Function
```

### Desenvolvimento Local

```
http://localhost:8080/                   → Frontend (Vite)
http://localhost:8081/                   → Backend Express (dev)
http://localhost:3000/api/health         → Serverless Functions (vercel dev)
```

---

## 🔄 Atualizar Frontend para Usar API

### packages/frontend/src/config/api.ts

```typescript
// Em produção, usa o mesmo domínio
// Em desenvolvimento, pode usar localhost:3000 (vercel dev) ou localhost:8081 (Express)

const isDevelopment = import.meta.env.DEV
const isVercelDev = import.meta.env.VITE_VERCEL_DEV === 'true'

export const API_URL = isDevelopment && !isVercelDev
  ? 'http://localhost:8081'  // Express local
  : ''  // Mesmo domínio (produção) ou vercel dev usa localhost:3000
```

**Uso:**
```typescript
// Em produção: /api/health
// Em dev: http://localhost:8081/health ou http://localhost:3000/api/health
const response = await fetch(`${API_URL}/api/health`)
```

---

## ✅ Checklist

- [ ] `vercel.json` criado na raiz
- [ ] `scripts/sync-api-functions.sh` criado e executável
- [ ] `package.json` com script `vercel-build`
- [ ] `api/` adicionado ao `.gitignore`
- [ ] Funções em `packages/backend/api/` criadas
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Root Directory vazio (ou configurado)
- [ ] Build Command: `npm run vercel-build`
- [ ] Output Directory: `packages/frontend/dist`
- [ ] Primeiro deploy realizado
- [ ] Endpoints testados

---

## 🐛 Troubleshooting

### Problema: Funções não são detectadas

**Solução:**
- Verificar se `api/` existe após build
- Verificar logs do build no Vercel
- Verificar se `sync-api-functions.sh` está sendo executado

### Problema: CORS não funciona

**Solução:**
- Verificar headers no `vercel.json`
- Verificar CORS headers nas funções
- Verificar `FRONTEND_URL` nas variáveis de ambiente

### Problema: Build falha

**Solução:**
- Verificar se `packages/backend/api/` existe
- Verificar permissões do script `sync-api-functions.sh`
- Verificar logs de build no Vercel

---

## 💡 Dicas

1. **Organização:** Mantenha funções organizadas em `packages/backend/api/`
2. **TypeScript:** Use tipos do `@vercel/node` para Request/Response
3. **CORS:** Configure uma vez no `vercel.json` e nas funções
4. **Variáveis:** Use variáveis de ambiente para configurações
5. **Logs:** Use `console.log` para debug (aparece no Vercel Dashboard)

---

## 🎯 Vantagens desta Arquitetura

1. ✅ **Simplicidade:** Tudo em um projeto
2. ✅ **Deploy unificado:** Um push, tudo atualiza
3. ✅ **Custo:** Só paga Vercel
4. ✅ **Escalabilidade:** Serverless escala automaticamente
5. ✅ **Manutenibilidade:** Código organizado em monorepo
6. ✅ **Desenvolvimento:** Pode usar Express local ou Vercel dev

---

**Última atualização:** Janeiro 2025
