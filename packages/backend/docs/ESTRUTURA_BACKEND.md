# Estrutura Escalável do Backend
## Sistema Automático de Rotas com Logging e Controllers

---

## 🎯 Visão Geral

O backend usa uma arquitetura **Route → Controller → Response**:

1. ✅ **Routes (`api/`)**: Define rotas e valida métodos HTTP
2. ✅ **Controllers (`src/controllers/`)**: Contém toda a lógica de negócio
3. ✅ **Middleware automático**: CORS, logging e error handling
4. ✅ **Helpers**: Respostas padronizadas

---

## 📁 Estrutura

```
packages/backend/
├── api/                          # Serverless Functions (Rotas)
│   ├── _middleware.ts           # Middleware genérico (CORS + Logging)
│   ├── _logger.ts               # Logger compartilhado
│   ├── _helpers.ts              # Helpers para respostas
│   ├── _template.ts             # Template para novas rotas
│   ├── health.ts                 # GET /api/health → healthController
│   ├── test.ts                   # GET,POST /api/test → testControllers
│   └── [nova-api].ts            # Adicione novas rotas aqui
│
├── src/
│   └── controllers/             # Controllers (Lógica de negócio)
│       ├── index.ts             # Exporta todos os controllers
│       ├── health.controller.ts
│       ├── test.controller.ts
│       └── _template.controller.ts
│
└── package.json
```

---

## 🚀 Como Funciona

### Arquitetura: Route → Controller → Response

```
Request 
  ↓
Route (api/*.ts) 
  → Valida método HTTP
  ↓
Controller (src/controllers/*.ts) 
  → Executa lógica de negócio
  ↓
Response
```

### Middleware Automático

Todas as rotas usam `withMiddleware()` que automaticamente:
- ✅ Aplica CORS headers
- ✅ Loga requests e responses
- ✅ Trata erros
- ✅ Calcula tempo de resposta

---

## 📝 Criar Nova API

### Exemplo: API de Usuários

**1. Criar Controller `src/controllers/users.controller.ts`:**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { successResponse, errorResponse } from '../../api/_helpers.js'

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

**2. Criar Route `api/users.ts`:**

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

**3. A rota será automaticamente disponível:**
- **Dev:** `GET http://localhost:8081/api/users` (se usar Express)
- **Prod:** `GET https://seudominio.com/api/users`

---

## 🔍 Logging Automático

### Request Log

```json
{
  "method": "GET",
  "path": "/api/health",
  "query": {},
  "headers": {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0..."
  },
  "timestamp": "2025-01-31T13:00:00.000Z",
  "ip": "::1"
}
```

### Response Log

```json
{
  "statusCode": 200,
  "responseTime": 5,
  "timestamp": "2025-01-31T13:00:00.005Z"
}
```

### Error Log

```json
{
  "error": {
    "name": "Error",
    "message": "User not found",
    "stack": "..."
  },
  "request": {
    "method": "GET",
    "path": "/api/users/999"
  },
  "timestamp": "2025-01-31T13:00:00.000Z"
}
```

---

## 🛠️ Helpers Disponíveis

### Response Helpers

```typescript
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse,
  unauthorizedResponse,
  badRequestResponse 
} from '../api/_helpers.js'

// Sucesso
successResponse(res, data, 'Mensagem opcional', 200)

// Erro
errorResponse(res, 'Mensagem de erro', 500)

// 404
notFoundResponse(res, 'User')

// 401
unauthorizedResponse(res, 'Token inválido')

// 400
badRequestResponse(res, 'Dados inválidos')
```

### Validation Helper

```typescript
import { validateMethod } from '../api/_helpers.js'

// Validar método HTTP
if (!validateMethod(req, res, ['GET', 'POST'])) {
  return // Já enviou resposta de erro
}
```

---

## 📊 Organização com Subdiretórios

Você pode organizar controllers e rotas em subdiretórios:

```
api/
├── health.ts
├── test.ts
├── users/
│   ├── list.ts          → GET /api/users/list
│   └── create.ts         → POST /api/users/create

src/controllers/
├── health.controller.ts
├── users/
│   ├── list.controller.ts
│   └── create.controller.ts
```

---

## ✅ Vantagens

1. ✅ **Separação clara:** Rotas vs Lógica
2. ✅ **Reutilização:** Controllers podem ser usados em múltiplas rotas
3. ✅ **Testabilidade:** Controllers fáceis de testar
4. ✅ **Manutenção:** Lógica organizada por domínio
5. ✅ **Escalabilidade:** Fácil adicionar novos endpoints
6. ✅ **Logging automático:** Todas as requests logadas
7. ✅ **CORS automático:** Headers configurados automaticamente
8. ✅ **Error handling:** Erros capturados e logados

---

## 🎯 Próximos Passos

1. **Adicionar novas APIs:** Crie controller + route
2. **Organizar:** Use subdiretórios se necessário
3. **Logs:** Já estão automáticos!
4. **Testar:** Deploy na Vercel e teste os endpoints

---

**Última atualização:** Janeiro 2025
