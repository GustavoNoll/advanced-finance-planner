# Agent Skills

Estrutura de skills do Cursor para o projeto **advanced-finance-planner**. O Cursor carrega skills automaticamente de `.agents/skills/` e aplica com base no contexto da conversa.

## Skills Disponíveis

| Skill | Descrição |
|-------|-----------|
| `code-conventions` | Convenções de nomenclatura, imports, TypeScript e React |
| `project-structure` | Organização feature-based e estrutura do monorepo |
| `i18n` | Internacionalização (en/pt) com react-i18next |
| `react-patterns` | Padrões React, Vite, Tailwind e data fetching |

## Uso

- **Automático**: O agente aplica skills relevantes conforme o contexto.
- **Manual**: Digite `/` no chat do Agent e procure pelo nome da skill.

## Estrutura

```
.agents/
├── skills/
│   ├── code-conventions/
│   │   └── SKILL.md
│   ├── project-structure/
│   │   └── SKILL.md
│   ├── i18n/
│   │   └── SKILL.md
│   └── react-patterns/
│       └── SKILL.md
└── README.md (este arquivo)
```

## Diretórios Opcionais por Skill

Cada skill pode incluir:

- `scripts/` - Código executável
- `references/` - Documentação adicional
- `assets/` - Templates, imagens, dados

## Referências

- [Agent Skills | Cursor Docs](https://cursor.com/docs/context/skills)
- [Agent Skills Standard](https://agentskills.io/)
