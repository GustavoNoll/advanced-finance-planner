# Deploy Backend na Vercel
## Serverless Functions

---

## 🎯 Arquitetura

```
Vercel (1 projeto)
├── Frontend (SPA)
│   └── packages/frontend/dist/
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

---

## 📋 Configuração

### 1. Estrutura

As funções em `packages/backend/api/` são sincronizadas para `api/` na raiz durante o build.

### 2. vercel.json (Raiz do Projeto)

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
  ]
}
```

### 3. Script de Sincronização

O script `scripts/sync-api-functions.sh` copia as funções de `packages/backend/api/` para `api/` na raiz.

### 4. Variáveis de Ambiente

Configure no Vercel Dashboard:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `FRONTEND_URL`
- `NODE_ENV=production`

---

## 🚀 Deploy

1. **Commit e Push:**
```bash
git add .
git commit -m "feat: add new API endpoint"
git push
```

2. **Vercel detecta automaticamente** e faz deploy

3. **Verificar:**
   - Settings → Functions → Deve mostrar as funções
   - Testar endpoints: `https://seudominio.com/api/health`

---

## 🔍 Troubleshooting

### Problema: 404 nas rotas

**Solução:**
1. Verificar se `api/` está commitado no git
2. Verificar se `scripts/sync-api-functions.sh` está sendo executado
3. Verificar logs do build no Vercel

### Problema: Funções não são detectadas

**Solução:**
1. Verificar se arquivos estão em `packages/backend/api/`
2. Verificar se `@vercel/node` está instalado
3. Verificar se funções exportam `default`

---

**Última atualização:** Janeiro 2025
