# Foundation Life

SaaS de planejamento financeiro pessoal baseado em cenários futuros, focado em consumidores finais.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (projeto próprio para Foundation Life)
- i18n com i18next (pt-BR e en-US)

## Desenvolvimento

```bash
cd foundation-life
npm install
npm run dev
```

Aplicação ficará disponível em `http://localhost:3000`.

## Variáveis de ambiente

Configure no `.env.local`:

```bash
NEXT_PUBLIC_LIFE_SUPABASE_URL=...
NEXT_PUBLIC_LIFE_SUPABASE_ANON_KEY=...
```

Essas variáveis devem apontar para o projeto Supabase exclusivo do Foundation Life (independente do Foundation Hub).

