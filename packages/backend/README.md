# Backend Package - Serverless Functions

API Serverless Functions para Vercel com middleware genérico e helpers.

## 🏗️ Estrutura

```
packages/backend/
├── api/                   # Serverless Functions (Rotas)
│   ├── _middleware.ts    # Middleware genérico (CORS + Logging)
│   ├── _logger.ts        # Logger compartilhado
│   ├── _helpers.ts       # Helpers para respostas
│   ├── _template.ts      # Template para novas APIs
│   ├── health.ts         # GET /api/health → healthController
│   ├── test.ts           # GET,POST /api/test → testControllers
│   └── ...               # Adicione novas rotas aqui
│
├── src/
│   └── controllers/      # Controllers (Lógica de negócio)
│       ├── index.ts      # Exporta todos os controllers
│       ├── health.controller.ts
│       ├── test.controller.ts
│       └── _template.controller.ts
│
└── package.json
```

## 🚀 Como Funciona

### Middleware Automático

Todas as APIs usam `withMiddleware()` que automaticamente:
- ✅ Aplica CORS headers
- ✅ Loga requests e responses (usa logger compartilhado `_logger.ts`)
- ✅ Trata erros
- ✅ Calcula tempo de resposta

**O logger é compatível com `packages/backend/src/middleware/logger.ts`** - mesma estrutura de logs!

### Helpers Disponíveis

- `successResponse()` - Resposta de sucesso padronizada
- `errorResponse()` - Resposta de erro padronizada
- `validateMethod()` - Valida métodos HTTP permitidos
- `notFoundResponse()` - 404 padronizado
- `unauthorizedResponse()` - 401 padronizado
- `badRequestResponse()` - 400 padronizado

## 🏗️ Arquitetura

**Separação de Responsabilidades:**
- **Routes (`api/`)**: Define rotas e valida métodos HTTP
- **Controllers (`src/controllers/`)**: Contém a lógica de negócio
- **Helpers (`api/_helpers.ts`)**: Funções auxiliares para respostas

**Fluxo:**
```
Request → Route (api/*.ts) → Controller (src/controllers/*.ts) → Response
```

## 📝 Criar Nova API

### Exemplo: API de Usuários

**1. Criar Controller `packages/backend/src/controllers/users.controller.ts`:**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { successResponse, errorResponse, validateMethod } from '../../api/_helpers.js'

export async function getUsersController(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Sua lógica aqui
  const users = [
    { id: 1, name: 'João' },
    { id: 2, name: 'Maria' }
  ]
  
  successResponse(res, users, 'Usuários listados com sucesso')
}

export async function createUserController(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const { name } = req.body
  
  if (!name) {
    return errorResponse(res, 'Nome é obrigatório', 400)
  }

  const newUser = { id: 3, name }
  successResponse(res, newUser, 'Usuário criado', 201)
}
```

**2. Criar Route `packages/backend/api/users.ts`:**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withMiddleware } from './_middleware.js'
import { validateMethod } from './_helpers.js'
import { getUsersController, createUserController } from '../src/controllers/users.controller.js'

function handler(req: VercelRequest, res: VercelResponse) {
  // Validar método
  if (!validateMethod(req, res, ['GET', 'POST'])) {
    return
  }

  // Chamar controller apropriado
  if (req.method === 'GET') {
    return getUsersController(req, res)
  }

  if (req.method === 'POST') {
    return createUserController(req, res)
  }
}

// Exportar com middleware aplicado
export default withMiddleware(handler)
```

**2. A rota será automaticamente disponível:**
- `GET https://seudominio.com/api/users`
- `POST https://seudominio.com/api/users`

**3. Logs automáticos:**
```
📥 Request: {
  "method": "GET",
  "path": "/api/users",
  "timestamp": "2025-01-31T13:00:00.000Z"
}

📤 Response: {
  "statusCode": 200,
  "responseTime": 12,
  "timestamp": "2025-01-31T13:00:00.012Z"
}

⏱️  Total time: 12ms
```

## 🎯 Vantagens

1. ✅ **Simples:** Apenas escreva a lógica, middleware é automático
2. ✅ **Logging automático:** Todas as requests/responses logadas
3. ✅ **CORS automático:** Headers configurados automaticamente
4. ✅ **Error handling:** Erros capturados e logados
5. ✅ **Type-safe:** TypeScript em tudo
6. ✅ **Padronizado:** Respostas consistentes

## 📋 Template Rápido

Use `_template.ts` como base para novas APIs:

```bash
cp api/_template.ts api/nova-api.ts
```

## ⚙️ Variáveis de Ambiente

Configure no Vercel Dashboard:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `FRONTEND_URL`
- `NODE_ENV=production`

---

## 📚 Documentação

Documentação adicional disponível em `docs/`:

- **[ESTRUTURA_BACKEND.md](./docs/ESTRUTURA_BACKEND.md)** - Estrutura detalhada e exemplos
- **[VERCEL_DEPLOY.md](./docs/VERCEL_DEPLOY.md)** - Guia de deploy na Vercel
- **[FIX_404_API.md](./docs/FIX_404_API.md)** - Troubleshooting de problemas comuns

---

**Última atualização:** Janeiro 2025
