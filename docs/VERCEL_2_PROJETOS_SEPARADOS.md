# Configuração Vercel - 2 Projetos Separados
## Frontend e Backend Independentes

---

## 🎯 Objetivo

Configurar **2 projetos Vercel separados**:
- **Projeto Frontend:** Deploy do React + Vite
- **Projeto Backend:** Deploy das Serverless Functions

**Vantagens:**
- ✅ Deploy completamente independente
- ✅ Escalabilidade separada
- ✅ Domínios diferentes (ex: `app.seudominio.com` e `api.seudominio.com`)
- ✅ Equipes podem trabalhar independentemente
- ✅ Mais claro e organizado

---

## 📋 Passo a Passo

### 1. Criar Projeto Frontend na Vercel

#### 1.1 Novo Projeto

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **Add New** → **Project**
3. Conecte seu repositório GitHub
4. Selecione o repositório `advanced-finance-planner`

#### 1.2 Configurar Projeto Frontend

**Nome do Projeto:**
```
advanced-finance-planner-frontend
```
ou
```
advanced-finance-planner-app
```

**Root Directory:**
```
packages/frontend
```

**Framework Preset:**
```
Vite
```

**Build Command:**
```
npm run build
```
(Deixar vazio ou usar o padrão do Vite)

**Output Directory:**
```
dist
```

**Install Command:**
```
cd ../.. && npm install
```
ou simplesmente:
```
npm install
```
(Workspaces instalam tudo automaticamente)

**Node.js Version:**
```
20.x
```

#### 1.3 Environment Variables (Frontend)

Vá em **Settings** → **Environment Variables** e adicione:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://api.seudominio.com (URL do backend)
VITE_N8N_PDF_IMPORT_URL=your_n8n_url (se usar)
```

**Importante:**
- ✅ Todas com prefixo `VITE_`
- ✅ Configure para Production, Preview e Development
- ✅ `VITE_API_URL` deve apontar para o projeto backend

#### 1.4 Domínio (Frontend)

Configure um domínio customizado:
- `app.seudominio.com` ou
- `seudominio.com` (domínio principal)

---

### 2. Criar Projeto Backend na Vercel

#### 2.1 Novo Projeto

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **Add New** → **Project**
3. Selecione o **mesmo repositório** `advanced-finance-planner`

#### 2.2 Configurar Projeto Backend

**Nome do Projeto:**
```
advanced-finance-planner-backend
```
ou
```
advanced-finance-planner-api
```

**Root Directory:**
```
packages/backend
```

**Framework Preset:**
```
Other
```

**Build Command:**
```
npm run build
```
ou deixar **vazio** (não precisa build para Serverless Functions)

**Output Directory:**
```
(Deixar vazio)
```

**Install Command:**
```
cd ../.. && npm install
```

**Node.js Version:**
```
20.x
```

#### 2.3 Environment Variables (Backend)

Vá em **Settings** → **Environment Variables** e adicione:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
FRONTEND_URL=https://app.seudominio.com
NODE_ENV=production
```

**Importante:**
- ✅ **Sem prefixo** (não são variáveis do Vite)
- ✅ `FRONTEND_URL` é usada para configurar CORS (URL do projeto frontend)
- ✅ Configure para Production, Preview e Development

#### 2.4 Domínio (Backend)

Configure um domínio customizado:
- `api.seudominio.com` ou
- `backend.seudominio.com`

---

### 3. Estrutura de Arquivos

#### 3.1 Frontend

As funções do backend **não devem** estar no projeto frontend. O frontend apenas consome a API do backend.

**Estrutura:**
```
packages/frontend/
├── src/
├── public/
├── package.json
└── vite.config.ts
```

#### 3.2 Backend

As Serverless Functions devem estar em `api/` na raiz do package backend:

**Estrutura:**
```
packages/backend/
├── api/
│   ├── health.ts
│   └── test.ts
├── src/
├── package.json
└── tsconfig.json
```

**Importante:** A Vercel detecta automaticamente funções em `api/` dentro do Root Directory configurado.

---

### 4. Atualizar Frontend para Usar Backend

No frontend, você precisa configurar a URL da API:

#### 4.1 Criar arquivo de configuração

**packages/frontend/src/config/api.ts:**
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

export const apiClient = {
  baseURL: API_URL,
  // Adicionar axios ou fetch wrapper aqui se necessário
}
```

#### 4.2 Usar no código

```typescript
import { API_URL } from '@/config/api'

// Fazer chamadas para o backend
const response = await fetch(`${API_URL}/api/health`)
```

---

### 5. Configurar CORS no Backend

As funções do backend já têm CORS configurado, mas você pode ajustar:

**packages/backend/api/test.ts:**
```typescript
// Permitir apenas o domínio do frontend
res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
```

Adicione `FRONTEND_URL` nas variáveis de ambiente do backend:
```
FRONTEND_URL=https://app.seudominio.com
```

---

### 6. vercel.json (Opcional)

Com 2 projetos separados, você **não precisa** de `vercel.json` na raiz. Cada projeto tem sua própria configuração no dashboard.

**Arquivos já criados:**

**packages/frontend/vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**packages/backend/vercel.json:**
```json
{}
```

**Nota:** O `vercel.json` do backend está vazio porque a Vercel detecta automaticamente funções em `api/` dentro do Root Directory configurado (`packages/backend`).

---

## 🔧 Configuração Detalhada

### Projeto Frontend

| Configuração | Valor |
|-------------|-------|
| **Nome** | `advanced-finance-planner-frontend` |
| **Root Directory** | `packages/frontend` |
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `cd ../.. && npm install` |
| **Node.js** | 20.x |
| **Domínio** | `app.seudominio.com` |

### Projeto Backend

| Configuração | Valor |
|-------------|-------|
| **Nome** | `advanced-finance-planner-backend` |
| **Root Directory** | `packages/backend` |
| **Framework** | Other |
| **Build Command** | (vazio ou `npm run build`) |
| **Output Directory** | (vazio) |
| **Install Command** | `cd ../.. && npm install` |
| **Node.js** | 20.x |
| **Domínio** | `api.seudominio.com` |

---

## 🔄 Deploy

### Deploy Automático (Git)

Ambos os projetos detectam automaticamente pushes no repositório:

1. **Frontend:** Deploya quando há mudanças em `packages/frontend/`
2. **Backend:** Deploya quando há mudanças em `packages/backend/`

### Deploy Manual

**Frontend:**
```bash
cd packages/frontend
vercel --prod
```

**Backend:**
```bash
cd packages/backend
vercel --prod
```

---

## ✅ Verificação

Após configurar ambos os projetos:

### Frontend
- ✅ Site acessível em `https://app.seudominio.com`
- ✅ Console do browser sem erros
- ✅ Variáveis de ambiente funcionando

### Backend
- ✅ API acessível em `https://api.seudominio.com/api/health`
- ✅ Endpoint retorna `{ status: 'ok' }`
- ✅ CORS configurado corretamente

### Integração
- ✅ Frontend consegue fazer chamadas para o backend
- ✅ Sem erros de CORS
- ✅ Variável `VITE_API_URL` configurada corretamente

---

## 🔍 Troubleshooting

### Erro: Frontend não encontra backend

**Causa:** `VITE_API_URL` não configurada ou incorreta

**Solução:**
- Verificar se `VITE_API_URL` está configurada no projeto frontend
- Verificar se aponta para o domínio correto do backend
- Fazer novo deploy após adicionar variável

### Erro: CORS no backend

**Causa:** Backend não permite requisições do frontend

**Solução:**
- Verificar se `FRONTEND_URL` está configurada no backend
- Verificar headers CORS nas funções
- Adicionar domínio do frontend nas configurações CORS

### Erro: Backend não detecta funções

**Causa:** Funções não estão em `api/` dentro do Root Directory

**Solução:**
- Verificar se Root Directory está como `packages/backend`
- Verificar se funções estão em `packages/backend/api/`
- A Vercel detecta automaticamente funções em `api/` dentro do Root Directory

### Erro: Build do frontend falha

**Causa:** Dependências não instaladas corretamente

**Solução:**
- Verificar Install Command: `cd ../.. && npm install`
- Verificar se workspaces estão configurados
- Verificar se todas as dependências estão no `package.json` correto

---

## 📝 Resumo da Configuração

### Projeto 1: Frontend
```
Nome: advanced-finance-planner-frontend
Root: packages/frontend
Build: npm run build
Output: dist
Domínio: app.seudominio.com
```

### Projeto 2: Backend
```
Nome: advanced-finance-planner-backend
Root: packages/backend
Build: (vazio)
Output: (vazio)
Domínio: api.seudominio.com
```

### Variáveis de Ambiente

**Frontend:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` ← **Importante:** URL do backend

**Backend:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `FRONTEND_URL` ← **Importante:** URL do frontend (para CORS)

---

## 🚀 Próximos Passos

1. ✅ Criar projeto frontend na Vercel
2. ✅ Criar projeto backend na Vercel
3. ✅ Configurar variáveis de ambiente em ambos
4. ✅ Configurar domínios customizados
5. ✅ Fazer primeiro deploy de ambos
6. ✅ Testar integração frontend ↔ backend
7. ✅ Atualizar código do frontend para usar `VITE_API_URL`

---

**Última atualização:** Janeiro 2025
