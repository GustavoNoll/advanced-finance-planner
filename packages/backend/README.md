# Backend Package

API Express.js do Advanced Finance Planner.

## Estrutura

- `src/` - Código fonte do servidor Express (desenvolvimento local)
- `api/` - Vercel Serverless Functions (produção) ✅

## Desenvolvimento

```bash
# Na raiz do projeto
npm run dev:backend

# Ou dentro desta pasta
npm run dev
```

O servidor iniciará em `http://localhost:3001` (ou porta definida em `PORT`).

## Endpoints Disponíveis

### Desenvolvimento Local (Express)

Quando rodar `npm run dev:backend`:

- `GET http://localhost:8081/health` - Health check
- `GET http://localhost:8081/api/test` - Test endpoint
- `POST http://localhost:8081/api/test` - Test POST

### Produção (Serverless Functions)

Após deploy na Vercel:

- `GET https://seudominio.com/api/health` - Health check
- `GET https://seudominio.com/api/test` - Test endpoint
- `POST https://seudominio.com/api/test` - Test POST

**Nota:** As funções em `api/` são automaticamente deployadas como Serverless Functions na Vercel.

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
```

## Build

```bash
npm run build:backend
```

## Produção

O backend é deployado automaticamente como Serverless Functions na Vercel:

- ✅ Funções em `api/*.ts` são detectadas automaticamente
- ✅ Disponíveis em `https://seudominio.com/api/[nome-da-funcao]`
- ✅ Configurado no `vercel.json` da raiz do projeto

### Adicionar Novas Funções

Crie novos arquivos em `api/`:

```typescript
// packages/backend/api/nova-rota.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({ message: 'Nova rota funcionando!' })
}
```

A rota estará disponível em: `https://seudominio.com/api/nova-rota`
