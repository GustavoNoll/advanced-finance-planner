# Guia de Aplicação das Convenções

Este guia ajuda a aplicar as convenções de código documentadas em `docs/CONVENCOES_CODIGO.md`.

---

## 📋 Checklist de Aplicação

### 1. Nomenclatura de Arquivos

#### Componentes
- [ ] Renomear arquivos `PascalCase.tsx` → `kebab-case.tsx`
- [ ] Exemplo: `ActivityTracker.tsx` → `activity-tracker.tsx`
- [ ] Exemplo: `DashboardCard.tsx` → `dashboard-card.tsx`
- [ ] Exemplo: `Calculator.tsx` → `calculator.tsx`

#### Hooks
- [ ] Renomear arquivos `camelCase.ts` → `use-kebab-case.ts`
- [ ] Exemplo: `useAccessData.ts` → `use-access-data.ts`
- [ ] Exemplo: `useChartOptions.ts` → `use-chart-options.ts`
- [ ] Exemplo: `useInvestmentPlan.ts` → `use-investment-plan.ts`

**Nota:** Após renomear, atualize todos os imports que referenciam o arquivo.

---

### 2. Estrutura de Imports

Organize imports na seguinte ordem:

```typescript
// 1. Imports externos (React, bibliotecas)
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

// 2. Imports internos (shared/components)
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/currency'

// 3. Imports internos (feature-specific)
import { useUserData } from '@/features/auth/hooks/use-user-data'
import { UserService } from '@/features/auth/services/user.service'

// 4. Types/Interfaces
interface ComponentProps {
  // ...
}

// 5. Component/Hook/Function
export function Component({ ... }: ComponentProps) {
  // ...
}
```

---

### 3. Exports de Componentes

**Mudar de:**
```typescript
export const Component = ({ prop }: Props) => {
  // ...
}
```

**Para:**
```typescript
export function Component({ prop }: Props) {
  // ...
}
```

---

### 4. Exports de Hooks

**Mudar de:**
```typescript
export const useHook = () => {
  // ...
}
```

**Para:**
```typescript
export function useHook() {
  // ...
}
```

---

## 🔧 Script de Aplicação Automática

### Passo 1: Identificar Arquivos para Renomear

```bash
# Componentes com PascalCase
find packages/frontend/src/components -name "*.tsx" -type f | grep -E "[A-Z].*\.tsx$"

# Hooks com camelCase (não use-kebab-case)
find packages/frontend/src/hooks -name "use*.ts" -type f | grep -v "use-"
```

### Passo 2: Renomear Manualmente (Recomendado)

Renomeie arquivos um por vez e atualize os imports:

1. Renomeie o arquivo
2. Atualize imports em todos os arquivos que o referenciam
3. Teste se tudo funciona
4. Commit

### Passo 3: Atualizar Imports

Após renomear, use busca e substituição:

```bash
# Exemplo: após renomear ActivityTracker.tsx → activity-tracker.tsx
# Buscar: import.*ActivityTracker
# Substituir: import.*activity-tracker
```

---

## 📝 Exemplos de Correção

### Exemplo 1: Componente

**Antes:**
```typescript
// ActivityTracker.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLastActive } from '@/hooks/useLastActive';

export const ActivityTracker = ({ children }: Props) => {
  // ...
};
```

**Depois:**
```typescript
// activity-tracker.tsx
// 1. Imports externos
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 2. Imports internos (shared)
import { useLastActive } from '@/hooks/use-last-active'

// 3. Types
interface ActivityTrackerProps {
  children: React.ReactNode
}

// 4. Component
export function ActivityTracker({ children }: ActivityTrackerProps) {
  // ...
}
```

### Exemplo 2: Hook

**Antes:**
```typescript
// useChartOptions.ts
import { useState, useMemo } from 'react';
import { generateProjectionData } from '@/lib/calculations/chart-projections';

export const useChartOptions = (props) => {
  // ...
};
```

**Depois:**
```typescript
// use-chart-options.ts
// 1. Imports externos
import { useState, useMemo } from 'react'

// 2. Imports internos (shared)
import { generateProjectionData, ChartOptions } from '@/lib/calculations/chart-projections'
import type { InvestmentPlan } from '@/types/financial'

// 3. Types
interface UseChartOptionsProps {
  // ...
}

interface UseChartOptionsReturn {
  // ...
}

// 4. Hook
export function useChartOptions(props: UseChartOptionsProps): UseChartOptionsReturn {
  // ...
}
```

---

## ⚠️ Cuidados

1. **Renomear arquivos quebra imports**: Sempre atualize imports após renomear
2. **Teste após cada mudança**: Não renomeie muitos arquivos de uma vez
3. **Use busca e substituição**: Facilita atualizar múltiplos imports
4. **Commits incrementais**: Faça commits pequenos e frequentes

---

## 🎯 Prioridade

### Alta Prioridade (Fazer Primeiro)
1. Arquivos mais usados (importados em muitos lugares)
2. Componentes principais (App.tsx, páginas principais)
3. Hooks compartilhados

### Média Prioridade
1. Componentes de features específicas
2. Hooks de features específicas
3. Services

### Baixa Prioridade
1. Componentes de UI (shadcn/ui já segue padrões)
2. Utils e helpers

---

## ✅ Checklist de Verificação

Após aplicar convenções em um arquivo:

- [ ] Arquivo renomeado para kebab-case (se necessário)
- [ ] Imports organizados na ordem correta
- [ ] Componente usa `export function` (não `export const`)
- [ ] Types/Interfaces definidos antes do componente
- [ ] Sem `any` desnecessários
- [ ] Props tipadas corretamente
- [ ] Imports atualizados em todos os arquivos que referenciam

---

**Última atualização:** Janeiro 2025
