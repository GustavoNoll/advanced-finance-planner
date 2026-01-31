# Documentação da API

Documentação dos endpoints da API do Advanced Finance Planner.

---

## 📋 Índice

1. [Base URL](#base-url)
2. [Autenticação](#autenticação)
3. [Endpoints](#endpoints)
4. [Códigos de Status](#códigos-de-status)
5. [Tratamento de Erros](#tratamento-de-erros)

---

## Base URL

**Desenvolvimento:**
```
http://localhost:8081
```

**Produção:**
```
https://your-domain.com
```

Todas as rotas da API começam com `/api/`.

---

## Autenticação

Atualmente, a autenticação é gerenciada pelo Supabase no frontend. As Serverless Functions recebem o token via headers.

**Header:**
```
Authorization: Bearer <token>
```

---

## Endpoints

### Health Check

Verifica o status da API.

**GET** `/api/health`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "environment": "production"
}
```

**Exemplo de Uso:**
```bash
curl https://your-domain.com/api/health
```

---

### Test

Endpoint de teste para verificar funcionamento da API.

**GET** `/api/test`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "API is working",
  "method": "GET",
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

**POST** `/api/test`

**Request Body:**
```json
{
  "message": "Test message",
  "data": {
    "key": "value"
  }
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "POST request received",
  "received": {
    "message": "Test message",
    "data": {
      "key": "value"
    }
  },
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

**Exemplo de Uso:**
```bash
# GET
curl https://your-domain.com/api/test

# POST
curl -X POST https://your-domain.com/api/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "data": {"key": "value"}}'
```

---

## Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 405 | Method Not Allowed - Método HTTP não permitido |
| 500 | Internal Server Error - Erro no servidor |

---

## Tratamento de Erros

### Formato de Erro

Todas as respostas de erro seguem o formato:

```json
{
  "success": false,
  "error": "Mensagem de erro",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

### Exemplos de Erros

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request data",
  "code": "VALIDATION_ERROR",
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found",
  "code": "NOT_FOUND",
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR",
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

---

## CORS

A API está configurada para aceitar requisições do frontend.

**Headers CORS:**
- `Access-Control-Allow-Origin`: Configurado via `FRONTEND_URL`
- `Access-Control-Allow-Methods`: GET, POST, PUT, DELETE, PATCH, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization
- `Access-Control-Allow-Credentials`: true

---

## Rate Limiting

⚠️ **A implementar:** Rate limiting para prevenir abuso da API.

---

## Logging

Todas as requisições são logadas automaticamente com:
- Método HTTP
- Path
- Status code
- Tempo de resposta
- Timestamp

---

## Estrutura de Novos Endpoints

Para criar um novo endpoint:

1. **Criar arquivo em `packages/backend/api/`:**
   ```typescript
   // packages/backend/api/users.ts
   import type { VercelRequest, VercelResponse } from '@vercel/node'
   import { withMiddleware } from './_middleware.js'
   import { validateMethod } from './_helpers.js'
   import { usersController } from '../src/controllers/users.controller.js'

   function handler(req: VercelRequest, res: VercelResponse) {
     if (!validateMethod(req, res, ['GET', 'POST'])) {
       return
     }

     if (req.method === 'GET') {
       return usersController.getUsers(req, res)
     }

     if (req.method === 'POST') {
       return usersController.createUser(req, res)
     }
   }

   export default withMiddleware(handler)
   ```

2. **Criar controller em `packages/backend/src/controllers/`:**
   ```typescript
   // packages/backend/src/controllers/users.controller.ts
   import type { VercelRequest, VercelResponse } from '@vercel/node'
   import { successResponse, errorResponse } from '../utils/response-helper.js'

   export const usersController = {
     async getUsers(req: VercelRequest, res: VercelResponse) {
       try {
         // Lógica aqui
         return successResponse(res, { users: [] })
       } catch (error) {
         return errorResponse(res, error)
       }
     },

     async createUser(req: VercelRequest, res: VercelResponse) {
       try {
         // Lógica aqui
         return successResponse(res, { user: {} }, 201)
       } catch (error) {
         return errorResponse(res, error)
       }
     },
   }
   ```

3. **A função será sincronizada automaticamente para `api/` durante o build**

---

## Próximos Endpoints

Endpoints planejados para implementação:

- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Obter usuário
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

- `GET /api/investment-plans` - Listar planos de investimento
- `GET /api/investment-plans/:id` - Obter plano
- `POST /api/investment-plans` - Criar plano
- `PUT /api/investment-plans/:id` - Atualizar plano
- `DELETE /api/investment-plans/:id` - Deletar plano

---

**Última atualização:** Janeiro 2025
