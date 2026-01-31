# Configuração Vercel - 1 Projeto (Monorepo)
## Guia Prático Passo a Passo

---

## 🎯 Objetivo

Configurar **1 único projeto Vercel** para fazer deploy do frontend e backend (quando implementar Serverless Functions).

---

## 📋 Passo a Passo

### 1. Acessar Settings do Projeto

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **General**

---

### 2. Configurar Build Settings

Na seção **Build & Development Settings**, configure:

#### Root Directory
```
.
```
ou deixe **vazio** (padrão)

#### Framework Preset
```
Vite
```
(Deve estar já selecionado)

#### Build Command
```
npm run build:frontend
```

#### Output Directory
```
packages/frontend/dist
```

#### Install Command
```
npm install
```

#### Node.js Version
```
20.x
```
ou `18.x` (recomendado: 20.x)

---

### 3. Configurar Environment Variables

Vá em **Settings** → **Environment Variables**

#### Adicionar Variáveis do Frontend

Clique em **Add New** e adicione:

**Variável 1:**
```
Name: VITE_SUPABASE_URL
Value: (sua URL do Supabase)
Environment: Production, Preview, Development
```

**Variável 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: (sua chave anon do Supabase)
Environment: Production, Preview, Development
```

**Variável 3 (se usar):**
```
Name: VITE_N8N_PDF_IMPORT_URL
Value: (sua URL do N8N)
Environment: Production, Preview, Development
```

#### Adicionar Variáveis do Backend (Opcional)

Se suas Serverless Functions precisarem de variáveis:

**Variável 1:**
```
Name: SUPABASE_URL
Value: (sua URL do Supabase)
Environment: Production, Preview, Development
```

**Variável 2:**
```
Name: SUPABASE_SERVICE_KEY
Value: (sua service key do Supabase)
Environment: Production, Preview, Development
```

**Importante:**
- ✅ Variáveis do frontend devem ter prefixo `VITE_`
- ✅ Variáveis do backend NÃO têm prefixo
- ✅ Configure para **todas** as environments (Production, Preview, Development)
- ✅ Clique em **Save** após cada variável

---

### 4. Verificar vercel.json

O arquivo `vercel.json` na raiz já está configurado corretamente:

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

**Não precisa mudar nada!** ✅

---

### 5. Fazer Deploy

#### Opção A: Deploy Automático (Git)

1. **Commit e Push:**
```bash
git add .
git commit -m "feat: configure monorepo for Vercel"
git push
```

2. **Vercel detecta automaticamente** e faz deploy

3. **Verificar logs:**
   - Vá em **Deployments**
   - Clique no último deployment
   - Verifique se o build passou

#### Opção B: Deploy Manual

1. **Instalar Vercel CLI:**
```bash
npm i -g vercel
```

2. **Fazer deploy:**
```bash
vercel
```

3. **Seguir instruções** do CLI

---

### 6. Verificar Deploy

Após o deploy, verificar:

1. ✅ **Site está acessível** (URL fornecida pela Vercel)
2. ✅ **Console do browser** não mostra erros de variáveis
3. ✅ **Build logs** não mostram erros
4. ✅ **Funcionalidades básicas** funcionam
5. ✅ **Backend API funcionando:**
   - `https://seudominio.com/api/health` - Deve retornar `{ status: 'ok' }`
   - `https://seudominio.com/api/test` - Deve retornar `{ message: 'Backend API is working!' }`

---

## 🔍 Troubleshooting

### Erro: "Build command failed"

**Causa:** Comando de build não encontrado

**Solução:**
- Verificar se `npm run build:frontend` existe no `package.json` root
- Verificar se `packages/frontend/package.json` tem script `build`

### Erro: "Output directory not found"

**Causa:** Diretório de output incorreto

**Solução:**
- Verificar se `packages/frontend/dist` existe após build local
- Verificar se `outputDirectory` está correto no dashboard

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas

**Solução:**
- Verificar se `npm install` está rodando na raiz
- Verificar se workspaces estão configurados no `package.json` root

### Variáveis de ambiente não funcionam

**Causa:** Variáveis não configuradas ou sem prefixo `VITE_`

**Solução:**
- Verificar se variáveis têm prefixo `VITE_`
- Verificar se estão configuradas para Production
- Fazer novo deploy após adicionar variáveis

---

## ✅ Checklist Final

Antes de considerar completo, verificar:

- [ ] Root Directory configurado (`.` ou vazio)
- [ ] Build Command: `npm run build:frontend`
- [ ] Output Directory: `packages/frontend/dist`
- [ ] Install Command: `npm install`
- [ ] Framework: Vite
- [ ] Variáveis de ambiente configuradas (com `VITE_` prefix)
- [ ] Variáveis configuradas para Production, Preview e Development
- [ ] Primeiro deploy realizado
- [ ] Site funcionando em produção
- [ ] Sem erros no console do browser
- [ ] Build logs sem erros

---

## 🚀 Backend já Configurado! ✅

### Serverless Functions Disponíveis

O backend já está implementado como Serverless Functions em `packages/backend/api/`:

**Endpoints disponíveis após deploy:**

1. **Health Check:**
   ```
   GET /api/health
   ```
   Retorna status do backend

2. **Test Endpoint:**
   ```
   GET /api/test
   POST /api/test
   ```
   Endpoint de teste para verificar se a API está funcionando

### Como Funciona

- ✅ Funções em `packages/backend/api/*.ts` são automaticamente detectadas
- ✅ Disponíveis em `https://seudominio.com/api/[nome-da-funcao]`
- ✅ O `vercel.json` já está configurado
- ✅ CORS já está configurado nas funções

### Adicionar Novas Funções

Para adicionar novas rotas, crie arquivos em `packages/backend/api/`:

**Exemplo: `packages/backend/api/users.ts`**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  if (req.method === 'GET') {
    return res.json({ users: [] })
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}
```

A função estará disponível em: `https://seudominio.com/api/users`

---

## 📝 Resumo da Configuração

```
Vercel Dashboard Settings:
├── Root Directory: . (ou vazio)
├── Framework: Vite
├── Build Command: npm run build:frontend
├── Output Directory: packages/frontend/dist
├── Install Command: npm install
└── Node.js: 20.x

Environment Variables:
├── VITE_SUPABASE_URL (frontend)
├── VITE_SUPABASE_ANON_KEY (frontend)
├── SUPABASE_URL (backend - opcional)
├── SUPABASE_SERVICE_KEY (backend - opcional)
└── (outras variáveis)

Backend API Endpoints:
├── GET /api/health
└── GET|POST /api/test
```

---

**Última atualização:** Janeiro 2025
