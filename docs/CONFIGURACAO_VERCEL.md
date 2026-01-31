# Configuração Vercel - Monorepo
## O que mudar após migração para monorepo

---

## 📋 Checklist de Mudanças

### 1. Dashboard da Vercel (Settings do Projeto)

Acesse: **Vercel Dashboard → Seu Projeto → Settings → General**

#### Build & Development Settings

**Root Directory:**
- ✅ Deixe como está (raiz do projeto) ou configure como `.` (ponto)

**Build Command:**
```
npm run build:frontend
```
ou
```
npm run vercel-build
```

**Output Directory:**
```
packages/frontend/dist
```

**Install Command:**
```
npm install
```
(Workspaces instalam automaticamente todas as dependências)

**Framework Preset:**
- ✅ Vite (já deve estar configurado)

---

### 2. Environment Variables

Acesse: **Vercel Dashboard → Seu Projeto → Settings → Environment Variables**

#### Variáveis do Frontend (precisam do prefixo `VITE_`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_N8N_PDF_IMPORT_URL=your_n8n_url (se usar)
```

#### Variáveis do Backend (sem prefixo):
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
NODE_ENV=production
PORT=3001 (opcional)
```

**Importante:**
- ✅ Configure para **Production**, **Preview** e **Development**
- ✅ Frontend usa variáveis com `VITE_` prefix
- ✅ Backend usa variáveis sem prefixo

---

### 3. vercel.json (Já Atualizado ✅)

O arquivo `vercel.json` na raiz já está configurado corretamente:

```json
{
  "version": 2,
  "buildCommand": "npm run build:frontend",
  "outputDirectory": "packages/frontend/dist",
  "framework": "vite",
  "rewrites": [...],
  "functions": {
    "packages/backend/api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

**Não precisa mudar nada aqui!** ✅

---

### 4. Serverless Functions (Backend)

Se você quiser usar Serverless Functions do Vercel para o backend:

#### Opção A: Usar Express como Serverless Function

Crie `packages/backend/api/index.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import app from '../src/index'

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res)
}
```

#### Opção B: Criar Functions Individuais

Crie funções em `packages/backend/api/`:

```
packages/backend/api/
├── health.ts
├── test.ts
└── ...
```

Exemplo `packages/backend/api/test.ts`:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ message: 'Backend API is working!' })
}
```

**Por enquanto, você pode deixar o backend como está** (servidor Express local) e implementar Serverless Functions depois.

---

### 5. Deploy

#### Primeiro Deploy Após Migração

1. **Commit e Push:**
```bash
git add .
git commit -m "feat: migrate to monorepo structure"
git push
```

2. **Vercel detectará automaticamente** e fará o deploy

3. **Verificar Build Logs:**
   - Deve mostrar: `npm run build:frontend`
   - Output: `packages/frontend/dist`

#### Se o Deploy Falhar

**Erro: "Cannot find module"**
- ✅ Verificar se `npm install` está rodando na raiz
- ✅ Verificar se workspaces estão configurados

**Erro: "Build command failed"**
- ✅ Verificar se `build:frontend` existe no `package.json` root
- ✅ Verificar se `packages/frontend/package.json` tem o script `build`

**Erro: "Output directory not found"**
- ✅ Verificar se `packages/frontend/dist` existe após build
- ✅ Verificar se `outputDirectory` está correto

---

### 6. Verificações Pós-Deploy

Após o deploy, verificar:

1. ✅ **Frontend carrega corretamente**
2. ✅ **Variáveis de ambiente estão disponíveis** (verificar no console do browser)
3. ✅ **API routes funcionam** (se implementadas)
4. ✅ **Build logs não mostram erros**

---

## 🔄 Resumo das Mudanças

### O que MUDOU:
- ✅ Build command: `npm run build:frontend` (ao invés de `vite build`)
- ✅ Output directory: `packages/frontend/dist` (ao invés de `dist`)
- ✅ Estrutura de pastas: código agora em `packages/frontend/`

### O que NÃO MUDOU:
- ✅ Framework: Continua Vite
- ✅ Variáveis de ambiente: Mesmas variáveis
- ✅ Deploy: Continua automático via Git

---

## 📝 Configuração Recomendada no Dashboard

```
Root Directory: . (ou deixar vazio)
Build Command: npm run build:frontend
Output Directory: packages/frontend/dist
Install Command: npm install
Framework Preset: Vite
Node.js Version: 20.x (ou 18.x)
```

---

## 🆘 Troubleshooting

### Problema: Build falha com "workspace not found"
**Solução:** Verificar se `package.json` root tem `workspaces: ["packages/*"]`

### Problema: Variáveis de ambiente não funcionam
**Solução:** 
- Frontend: Variáveis devem ter prefixo `VITE_`
- Verificar se estão configuradas no dashboard da Vercel

### Problema: Backend não funciona em produção
**Solução:** 
- Backend atual é apenas para desenvolvimento local
- Para produção, implementar Serverless Functions em `packages/backend/api/`

---

## ✅ Checklist Final

- [ ] Build Command atualizado no dashboard
- [ ] Output Directory atualizado no dashboard
- [ ] Variáveis de ambiente configuradas
- [ ] Primeiro deploy realizado
- [ ] Frontend funcionando em produção
- [ ] Verificar logs de build (sem erros)

---

**Última atualização:** Janeiro 2025
