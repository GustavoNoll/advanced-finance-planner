# Fix 404 nas Serverless Functions
## Problema: `/api/health` retorna 404

---

## 🔴 Problema

Ao acessar `https://stage-nextwealth.vercel.app/api/health`, retorna 404.

---

## ✅ Solução

### 1. Commitar as funções no repositório

O Vercel detecta as funções **antes** do build command rodar. Por isso, as funções precisam estar commitadas:

```bash
# Remover api/ do .gitignore (já feito)
# Adicionar funções ao git
git add api/
git commit -m "feat: add serverless functions to api directory"
git push
```

### 2. Verificar estrutura

As funções devem estar em:
```
api/
├── health.ts
└── test.ts
```

### 3. Verificar vercel.json

O `vercel.json` deve estar na raiz e não precisa de configuração especial para funções (Vercel detecta automaticamente).

### 4. Instalar @vercel/node na raiz (se necessário)

```bash
npm install --save-dev @vercel/node
```

### 5. Fazer novo deploy

Após commitar as funções, fazer novo deploy no Vercel.

---

## 🔍 Verificações

### No Dashboard Vercel

1. **Settings → Functions**
   - Deve mostrar as funções detectadas
   - `api/health.ts`
   - `api/test.ts`

2. **Deployments → Build Logs**
   - Verificar se não há erros
   - Verificar se as funções foram detectadas

### Testar Localmente

```bash
# Instalar Vercel CLI
npm i -g vercel

# Rodar localmente
vercel dev
```

Acessar: `http://localhost:3000/api/health`

---

## 🐛 Troubleshooting

### Problema: Funções ainda não aparecem

**Solução:**
1. Verificar se `api/` está commitado no git
2. Verificar se os arquivos estão em `api/` (não em `packages/backend/api/`)
3. Verificar se `@vercel/node` está instalado
4. Limpar cache do Vercel e fazer novo deploy

### Problema: Erro "Cannot find module '@vercel/node'"

**Solução:**
```bash
# Instalar na raiz
npm install --save-dev @vercel/node
```

### Problema: Funções não são atualizadas

**Solução:**
- As funções em `api/` devem ser commitadas
- Ou usar o script `sync-api-functions.sh` no build command
- Mas o ideal é commitar diretamente

---

## 💡 Recomendação

**Opção 1: Commitar funções (Recomendado)**
- ✅ Mais simples
- ✅ Vercel detecta automaticamente
- ✅ Não depende do build command

**Opção 2: Gerar durante build**
- ⚠️ Mais complexo
- ⚠️ Pode ter problemas de timing
- ⚠️ Requer script no build command

---

**Última atualização:** Janeiro 2025
