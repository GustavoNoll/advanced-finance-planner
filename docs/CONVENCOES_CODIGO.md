# Convenções de Código

Este documento define as convenções de código para manter consistência e organização no projeto.

---

## 📋 Índice

1. [Nomenclatura](#nomenclatura)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Organização de Imports](#organização-de-imports)
4. [TypeScript](#typescript)
5. [React](#react)

---

## Nomenclatura

### Componentes React

**Arquivo:** `kebab-case.tsx`  
**Componente:** `PascalCase`

```typescript
// ✅ Correto
// arquivo: user-profile.tsx
export function UserProfile({ userName, onEdit }: UserProfileProps) {
  // ...
}

// ❌ Incorreto
// arquivo: UserProfile.tsx ou userProfile.tsx
export function userProfile({ user_name, on_edit }) {
  // ...
}
```

**Regras:**
- Arquivos sempre em `kebab-case`
- Nome do componente sempre em `PascalCase`
- Nome do arquivo deve corresponder ao nome do componente (ex: `user-profile.tsx` → `UserProfile`)

### Hooks

**Arquivo:** `use-kebab-case.ts`  
**Hook:** `camelCase` começando com `use`

```typescript
// ✅ Correto
// arquivo: use-user-data.ts
export function useUserData(userId: string) {
  // ...
}

// ❌ Incorreto
// arquivo: useUserData.ts ou getUserData.ts
export function getUserData(userId: string) {
  // ...
}
```

**Regras:**
- Sempre começam com `use`
- Arquivo em `kebab-case` com prefixo `use-`
- Nome do hook em `camelCase`

### Services

**Arquivo:** `kebab-case.service.ts`  
**Classe/Função:** `PascalCase`

```typescript
// ✅ Correto
// arquivo: user.service.ts
export class UserService {
  static async getUser(id: string): Promise<User> {
    // ...
  }
}

// ou função
export async function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Incorreto
// arquivo: UserService.ts ou userService.ts
export class userService {
  // ...
}
```

**Regras:**
- Arquivo sempre termina com `.service.ts`
- Nome da classe/função em `PascalCase`

### Types/Interfaces

**Arquivo:** `kebab-case.ts`  
**Type/Interface:** `PascalCase`

```typescript
// ✅ Correto
// arquivo: user.ts
export interface User {
  id: string
  name: string
  email: string
}

export type UserRole = 'admin' | 'user' | 'guest'

// ❌ Incorreto
// arquivo: User.ts
export interface user {
  id: string
}
```

**Regras:**
- Arquivo em `kebab-case`
- Interface/Type em `PascalCase`
- Props de componentes: `ComponentNameProps` (ex: `UserProfileProps`)

### Utils/Helpers

**Arquivo:** `kebab-case.ts`  
**Função:** `camelCase`

```typescript
// ✅ Correto
// arquivo: format-currency.ts
export function formatCurrency(value: number, currency: string): string {
  // ...
}

// ❌ Incorreto
// arquivo: formatCurrency.ts
export function FormatCurrency(value: number) {
  // ...
}
```

---

## Estrutura de Arquivos

### Ordem Padrão

```typescript
// 1. Imports externos (React, bibliotecas)
import React from 'react'
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
  userId: string
  onEdit?: () => void
}

// 5. Component/Hook/Function
export function Component({ userId, onEdit }: ComponentProps) {
  // ...
}

// 6. Helpers (se necessário, apenas para este arquivo)
function helperFunction() {
  // ...
}
```

### Regras de Imports

1. **Agrupar por origem:**
   - Externos primeiro
   - Shared depois
   - Feature-specific por último

2. **Ordem alfabética dentro de cada grupo**

3. **Usar aliases de path:**
   - `@/components` ao invés de `../../components`
   - `@/utils` ao invés de `../../utils`

4. **Evitar imports relativos profundos:**
   ```typescript
   // ❌ Evitar
   import { Button } from '../../../components/ui/button'
   
   // ✅ Preferir
   import { Button } from '@/components/ui/button'
   ```

---

## TypeScript

### Tipos Explícitos

```typescript
// ✅ Correto
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ❌ Incorreto
function calculateTotal(items: any): any {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

### Interfaces vs Types

**Use Interfaces para:**
- Objetos
- Props de componentes
- Classes

**Use Types para:**
- Unions (`'a' | 'b'`)
- Intersections (`A & B`)
- Mapped types
- Utility types

```typescript
// ✅ Interface para objeto
interface User {
  id: string
  name: string
}

// ✅ Type para union
type Status = 'pending' | 'approved' | 'rejected'

// ✅ Type para intersection
type AdminUser = User & { role: 'admin' }
```

### Evitar `any`

```typescript
// ❌ Evitar
function processData(data: any): any {
  // ...
}

// ✅ Preferir
function processData(data: unknown): ProcessedData {
  // ...
}
```

---

## React

### Componentes Funcionais

```typescript
// ✅ Preferir
export function UserProfile({ userId }: UserProfileProps) {
  // ...
}

// ❌ Evitar (a menos que necessário)
export const UserProfile = ({ userId }: UserProfileProps) => {
  // ...
}
```

### Props

```typescript
// ✅ Correto
interface UserProfileProps {
  userId: string
  showEmail?: boolean
  onEdit?: (userId: string) => void
}

export function UserProfile({ userId, showEmail = false, onEdit }: UserProfileProps) {
  // ...
}

// ❌ Incorreto
export function UserProfile(props: any) {
  // ...
}
```

### Hooks

```typescript
// ✅ Correto - sempre retornar objeto nomeado
export function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // ...

  return { user, loading, error }
}

// ❌ Incorreto - array não nomeado
export function useUserData(userId: string) {
  // ...
  return [user, loading, error] // difícil de usar
}
```

### Event Handlers

```typescript
// ✅ Correto
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault()
  // ...
}

// ✅ Ou mais simples
function handleClick() {
  // ...
}

// ❌ Evitar
function handleClick(e: any) {
  // ...
}
```

---

## Exemplos Completos

### Componente Completo

```typescript
// user-profile.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { useUserData } from '@/features/auth/hooks/use-user-data'
import { UserService } from '@/features/auth/services/user.service'

interface UserProfileProps {
  userId: string
  onEdit?: () => void
}

export function UserProfile({ userId, onEdit }: UserProfileProps) {
  const { user, loading, error } = useUserData(userId)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return null

  return (
    <Card>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {onEdit && <Button onClick={onEdit}>Edit</Button>}
    </Card>
  )
}
```

### Hook Completo

```typescript
// use-user-data.ts
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { UserService } from '@/features/auth/services/user.service'
import type { User } from '@/features/auth/types/user'

interface UseUserDataReturn {
  user: User | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useUserData(userId: string): UseUserDataReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserService.getUser(userId),
  })

  return {
    user: data ?? null,
    loading: isLoading,
    error: error as Error | null,
    refetch,
  }
}
```

---

## Checklist de Revisão

Antes de commitar, verifique:

- [ ] Nomenclatura segue as convenções
- [ ] Imports estão organizados corretamente
- [ ] Tipos TypeScript estão explícitos
- [ ] Componentes seguem o padrão de estrutura
- [ ] Não há `any` desnecessários
- [ ] Props estão tipadas corretamente

---

**Última atualização:** Janeiro 2025
