# Estrutura do Projeto

Este documento descreve a estrutura de pastas e organização do código no projeto.

---

## 📋 Visão Geral

O projeto usa uma estrutura de **monorepo** com workspaces npm:

```
advanced-finance-planner/
├── packages/
│   ├── frontend/     # React + Vite
│   ├── backend/      # Serverless Functions
│   └── shared/       # Código compartilhado
├── docs/             # Documentação
├── scripts/          # Scripts utilitários
└── tests/            # Testes globais
```

---

## Frontend (`packages/frontend/src/`)

### Estrutura Atual

```
src/
├── api/              # Configuração de API
├── assets/           # Assets estáticos (imagens, fonts)
├── components/       # Componentes React
│   ├── ui/          # Componentes de UI reutilizáveis (shadcn/ui)
│   ├── auth/        # Componentes de autenticação
│   ├── admin/       # Componentes administrativos
│   └── ...
├── config/           # Configurações (API, SEO)
├── constants/        # Constantes do projeto
├── contexts/         # React Contexts
├── data/             # Dados estáticos (JSON)
├── features/         # Features organizadas por domínio
│   └── investment-plans/
├── hooks/            # Hooks customizados
├── lib/              # Bibliotecas e utilitários
├── locales/          # Traduções i18n
├── pages/            # Páginas/rotas
├── services/         # Services (lógica de negócio)
├── types/            # Types TypeScript
└── utils/            # Funções utilitárias
```

### Estrutura Ideal (Feature-Based)

**Objetivo:** Organizar código por feature para melhor manutenibilidade.

```
src/
├── features/
│   ├── auth/
│   │   ├── components/     # Componentes específicos
│   │   ├── hooks/          # Hooks customizados
│   │   ├── services/       # Lógica de negócio
│   │   ├── types/          # Types específicos
│   │   └── index.ts        # Exports públicos
│   │
│   ├── financial-records/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── investment-plans/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── portfolio-performance/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── index.ts
│
├── shared/
│   ├── components/   # Componentes compartilhados
│   ├── hooks/        # Hooks compartilhados
│   ├── utils/        # Utilitários compartilhados
│   └── types/        # Types compartilhados
│
└── app/
    ├── routes/       # Configuração de rotas
    ├── providers/    # Providers globais
    └── layouts/      # Layouts da aplicação
```

### Benefícios da Organização por Features

1. **Código relacionado agrupado**: Tudo de uma feature em um lugar
2. **Facilita remoção**: Remover uma feature é simples
3. **Reduz acoplamento**: Features não dependem umas das outras
4. **Melhor navegação**: Fácil encontrar código relacionado

---

## Backend (`packages/backend/`)

### Estrutura Atual

```
backend/
├── api/              # Serverless Functions (Vercel)
│   ├── _middleware.ts
│   ├── _helpers.ts
│   ├── _logger.ts
│   ├── health.ts
│   └── test.ts
│
└── src/
    ├── controllers/  # Lógica de negócio
    ├── middleware/   # Middlewares Express
    ├── utils/        # Utilitários
    └── types/        # Types TypeScript
```

### Padrão de API

Cada endpoint segue o padrão:

```
api/
  nome-endpoint.ts
    ↓
src/
  controllers/
    nome.controller.ts
```

**Exemplo:**
- `api/users.ts` → `src/controllers/users.controller.ts`
- `api/investment-plans.ts` → `src/controllers/investment-plans.controller.ts`

---

## Shared (`packages/shared/src/`)

### Estrutura

```
shared/
└── src/
    ├── config/      # Configurações compartilhadas
    ├── types/        # Types compartilhados
    └── utils/        # Utilitários compartilhados
```

**Uso:**
- Types que são usados em frontend e backend
- Utilitários compartilhados
- Configurações comuns

---

## Convenções de Pastas

### Features

Cada feature deve ter:
- `components/` - Componentes específicos da feature
- `hooks/` - Hooks customizados
- `services/` - Lógica de negócio
- `types/` - Types específicos
- `index.ts` - Exports públicos da feature

### Shared

Componentes/hooks/utils que são usados por múltiplas features.

### Nomenclatura

- Pastas: `kebab-case`
- Arquivos: `kebab-case.tsx` ou `kebab-case.ts`
- Componentes: `PascalCase`
- Funções/Hooks: `camelCase`

---

## Migração para Feature-Based

### Passo a Passo

1. **Identificar features existentes:**
   - auth
   - financial-records
   - investment-plans
   - portfolio-performance

2. **Mover código relacionado:**
   - Componentes → `features/[nome]/components/`
   - Hooks → `features/[nome]/hooks/`
   - Services → `features/[nome]/services/`
   - Types → `features/[nome]/types/`

3. **Atualizar imports:**
   - Usar aliases `@/features/[nome]/...`
   - Atualizar todos os arquivos que importam

4. **Criar index.ts:**
   - Exportar apenas o que é público
   - Manter API limpa

### Exemplo de Migração

**Antes:**
```
src/
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   └── investment-plan/
│       └── InvestmentPlanCard.tsx
├── hooks/
│   └── useInvestmentPlans.ts
└── services/
    └── investmentPlan.service.ts
```

**Depois:**
```
src/
└── features/
    ├── auth/
    │   ├── components/
    │   │   └── login-form.tsx
    │   └── index.ts
    └── investment-plans/
        ├── components/
        │   └── investment-plan-card.tsx
        ├── hooks/
        │   └── use-investment-plans.ts
        ├── services/
        │   └── investment-plan.service.ts
        └── index.ts
```

---

## Checklist de Organização

- [ ] Cada feature tem sua própria pasta
- [ ] Código relacionado está agrupado
- [ ] Imports usam aliases (`@/features/...`)
- [ ] Cada feature tem `index.ts` com exports públicos
- [ ] Componentes grandes foram divididos
- [ ] Lógica de negócio está em services/hooks
- [ ] Types estão organizados por feature

---

**Última atualização:** Janeiro 2025
