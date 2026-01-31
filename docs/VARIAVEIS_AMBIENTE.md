# Variáveis de Ambiente - Documentação Completa

**Última atualização:** Janeiro 2025  
**Versão:** 1.0

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Variáveis do Frontend](#variáveis-do-frontend)
3. [Variáveis do Backend](#variáveis-do-backend)
4. [Variáveis Opcionais](#variáveis-opcionais)
5. [Configuração por Ambiente](#configuração-por-ambiente)
6. [Validação Automática](#validação-automática)
7. [Troubleshooting](#troubleshooting)

---

## Visão Geral

Este projeto usa variáveis de ambiente para configuração. As variáveis são separadas em duas categorias:

- **Frontend (VITE_*)**: Expostas no bundle do cliente (NUNCA coloque secrets aqui!)
- **Backend**: Seguras, não expostas ao cliente (use para secrets e API keys)

### Arquivo de Referência

Copie `.env.example` para `.env` e preencha com seus valores:

```bash
cp .env.example .env
```

**⚠️ IMPORTANTE:** O arquivo `.env` está no `.gitignore` e NUNCA deve ser commitado!

---

## Variáveis do Frontend

Todas as variáveis do frontend devem ter o prefixo `VITE_` para serem expostas pelo Vite.

### Obrigatórias

#### `VITE_SUPABASE_URL`
- **Tipo:** URL
- **Descrição:** URL do projeto Supabase
- **Exemplo:** `https://your-project.supabase.co`
- **Onde obter:** [Supabase Dashboard](https://app.supabase.com/project/_/settings/api) → Project URL

#### `VITE_SUPABASE_ANON_KEY`
- **Tipo:** String
- **Descrição:** Chave pública (anon key) do Supabase para o frontend
- **Exemplo:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Onde obter:** [Supabase Dashboard](https://app.supabase.com/project/_/settings/api) → anon/public key
- **⚠️ Segurança:** Esta chave é pública e exposta no bundle. Use apenas para operações que o cliente pode executar.

### Opcionais

#### `VITE_API_URL`
- **Tipo:** URL (opcional)
- **Descrição:** URL do backend API
- **Padrão em desenvolvimento:** `http://localhost:8081`
- **Padrão em produção:** Vazio (usa o mesmo domínio - Serverless Functions)
- **Exemplo:** `http://localhost:8081` (desenvolvimento)

#### `VITE_ENVIRONMENT`
- **Tipo:** Enum (`development` | `production` | `staging`)
- **Descrição:** Ambiente atual da aplicação
- **Padrão:** `development`

#### `VITE_BASE_URL`
- **Tipo:** URL (opcional)
- **Descrição:** URL base da aplicação (usado para SEO)
- **Exemplo:** `https://your-domain.com`

#### `VITE_N8N_PDF_IMPORT_URL`
- **Tipo:** URL (opcional)
- **Descrição:** URL do webhook N8N para importação de PDFs
- **Exemplo:** `https://your-n8n-instance.com/webhook/pdf-import`

---

## Variáveis do Backend

Variáveis do backend NÃO têm prefixo e são seguras (não expostas ao cliente).

### Obrigatórias

#### `SUPABASE_URL`
- **Tipo:** URL
- **Descrição:** URL do projeto Supabase (mesma do frontend)
- **Exemplo:** `https://your-project.supabase.co`
- **Onde obter:** [Supabase Dashboard](https://app.supabase.com/project/_/settings/api) → Project URL

#### `SUPABASE_SERVICE_KEY`
- **Tipo:** String
- **Descrição:** Chave de serviço (service role key) do Supabase para operações administrativas
- **Exemplo:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Onde obter:** [Supabase Dashboard](https://app.supabase.com/project/_/settings/api) → service_role key
- **⚠️ Segurança:** Esta chave tem privilégios administrativos. NUNCA exponha no frontend!

#### `FRONTEND_URL`
- **Tipo:** URL ou `*`
- **Descrição:** URL do frontend (usado para CORS)
- **Padrão:** `*` (permite todas as origens)
- **Exemplo em desenvolvimento:** `http://localhost:8080`
- **Exemplo em produção:** `https://your-domain.com`

### Opcionais

#### `NODE_ENV`
- **Tipo:** Enum (`development` | `production` | `test`)
- **Descrição:** Ambiente Node.js
- **Padrão:** `development`

#### `PORT`
- **Tipo:** Number
- **Descrição:** Porta do servidor (apenas para desenvolvimento local)
- **Padrão:** `8081`
- **Nota:** Em produção na Vercel, a porta é gerenciada automaticamente

#### `FRED_API_KEY`
- **Tipo:** String (opcional)
- **Descrição:** Chave da API FRED (Federal Reserve Economic Data) para dados econômicos dos EUA
- **Onde obter:** [FRED API](https://fred.stlouisfed.org/docs/api/api_key.html)

---

## Configuração por Ambiente

### Desenvolvimento Local

1. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Preencha as variáveis obrigatórias:
   ```bash
   # Frontend
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   
   # Backend
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key
   FRONTEND_URL=http://localhost:8080
   ```

3. Inicie os servidores:
   ```bash
   npm run dev
   ```

### Produção (Vercel)

Configure as variáveis no Dashboard da Vercel:

1. Acesse: **Vercel Dashboard → Seu Projeto → Settings → Environment Variables**

2. Adicione todas as variáveis para **Production**, **Preview** e **Development**

3. Variáveis necessárias:
   ```
   # Frontend
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   
   # Backend
   SUPABASE_URL=...
   SUPABASE_SERVICE_KEY=...
   FRONTEND_URL=https://your-domain.com
   NODE_ENV=production
   ```

4. Deploy automático após commit no Git

---

## Validação Automática

O projeto usa **Zod** para validação automática de variáveis de ambiente.

### Frontend

As variáveis são validadas automaticamente no startup:

```typescript
// packages/frontend/src/lib/supabase.ts
import { validateFrontendEnv } from '@app/shared/config/env'

const env = validateFrontendEnv() // Valida e lança erro se inválido
```

### Backend

As variáveis são validadas no startup do servidor:

```typescript
// packages/backend/src/index.ts
import { validateBackendEnv } from '@app/shared/config/env'

const env = validateBackendEnv() // Valida e lança erro se inválido
```

### Erros de Validação

Se uma variável obrigatória estiver faltando ou inválida, você verá:

```
❌ Frontend environment variables validation failed:
   - VITE_SUPABASE_URL: Required
   - VITE_SUPABASE_ANON_KEY: Required
```

**Solução:** Verifique o arquivo `.env` e certifique-se de que todas as variáveis obrigatórias estão preenchidas.

---

## Troubleshooting

### Erro: "Supabase credentials are not set"

**Causa:** Variáveis `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` não estão definidas.

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se as variáveis estão preenchidas
3. Reinicie o servidor de desenvolvimento

### Erro: "Invalid frontend environment variables"

**Causa:** Uma variável obrigatória está faltando ou tem formato inválido.

**Solução:**
1. Verifique a mensagem de erro para identificar qual variável está com problema
2. Compare com `.env.example`
3. Certifique-se de que URLs estão no formato correto (começam com `http://` ou `https://`)

### Variáveis não estão sendo carregadas

**Causa:** O Vite pode não estar carregando o `.env` corretamente.

**Solução:**
1. Verifique se o arquivo está na raiz do projeto (não em `packages/frontend/`)
2. Verifique se o `vite.config.ts` tem `envDir` configurado:
   ```typescript
   envDir: path.resolve(__dirname, "../..")
   ```
3. Reinicie o servidor de desenvolvimento

### CORS Error no Backend

**Causa:** `FRONTEND_URL` não está configurado corretamente.

**Solução:**
1. Em desenvolvimento: `FRONTEND_URL=http://localhost:8080`
2. Em produção: `FRONTEND_URL=https://your-domain.com`
3. Para permitir todas as origens: `FRONTEND_URL=*`

---

## Referências

- [Documentação do Vite - Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase - Getting Started](https://supabase.com/docs/guides/getting-started)
- [Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Zod - Runtime Type Validation](https://zod.dev/)

---

**Documentação criada em:** Janeiro 2025  
**Última atualização:** Janeiro 2025
