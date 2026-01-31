# Resumo Rápido - 2 Projetos Vercel

## 🎯 Configuração Rápida

### Projeto 1: Frontend

**Dashboard Vercel:**
- Nome: `advanced-finance-planner-frontend`
- Root Directory: `packages/frontend`
- Framework: Vite
- Build Command: `npm run build` (ou deixar vazio)
- Output Directory: `dist`
- Install Command: `cd ../.. && npm install`

**Environment Variables:**
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://api.seudominio.com  ← URL do backend
```

**Domínio:** `app.seudominio.com` ou `seudominio.com`

---

### Projeto 2: Backend

**Dashboard Vercel:**
- Nome: `advanced-finance-planner-backend`
- Root Directory: `packages/backend`
- Framework: Other
- Build Command: (vazio)
- Output Directory: (vazio)
- Install Command: `cd ../.. && npm install`

**Environment Variables:**
```
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
FRONTEND_URL=https://app.seudominio.com  ← URL do frontend (para CORS)
NODE_ENV=production
```

**Importante:** `FRONTEND_URL` deve ser a URL exata do projeto frontend (ex: `https://advanced-finance-planner-frontend.vercel.app` ou seu domínio customizado).

**Domínio:** `api.seudominio.com`

---

## ✅ Checklist

### Frontend
- [ ] Projeto criado na Vercel
- [ ] Root Directory: `packages/frontend`
- [ ] Variáveis de ambiente configuradas
- [ ] `VITE_API_URL` aponta para o backend
- [ ] Deploy realizado

### Backend
- [ ] Projeto criado na Vercel
- [ ] Root Directory: `packages/backend`
- [ ] Variáveis de ambiente configuradas
- [ ] `FRONTEND_URL` configurada para CORS
- [ ] Deploy realizado

### Integração
- [ ] Frontend consegue chamar backend
- [ ] CORS funcionando
- [ ] Endpoints testados

---

## 📝 Arquivos Criados

- ✅ `packages/frontend/vercel.json` - Config do frontend
- ✅ `packages/backend/vercel.json` - Config do backend
- ✅ `packages/frontend/src/config/api.ts` - Configuração de API

---

**Para mais detalhes, consulte:** `docs/VERCEL_2_PROJETOS_SEPARADOS.md`
