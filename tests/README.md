# Tests

Este diretório contém os testes automatizados do projeto.

## Estrutura

```
tests/
├── i18n-keys.test.ts    # Testes de validação das chaves de tradução
└── README.md            # Este arquivo
```

## Configuração

O projeto usa [Vitest](https://vitest.dev/) como framework de testes, que é otimizado para projetos Vite.

### Instalação

As dependências de teste já estão incluídas no `package.json`. Para instalar:

```bash
npm install
```

## Rodando os Testes

### Todos os testes

```bash
npm test
```

### Modo watch (desenvolvimento)

```bash
npm run test:watch
```

### Com interface visual

```bash
npm run test:ui
```

### Teste específico

```bash
npm test -- tests/i18n-keys.test.ts
```

## Testes de i18n

O arquivo `i18n-keys.test.ts` valida a consistência das traduções entre pt-BR e en-US:

### O que é testado:

1. **Todas as chaves do pt-BR existem no en-US**
   - Garante que nenhuma tradução em português ficou sem correspondente em inglês

2. **Todas as chaves do en-US existem no pt-BR**
   - Garante que nenhuma tradução em inglês ficou sem correspondente em português

3. **Mesmo número de chaves**
   - Verifica que ambos os arquivos têm a mesma quantidade de chaves

4. **Sem valores vazios**
   - Garante que não há strings vazias em nenhum dos arquivos

### Exemplo de saída em caso de erro:

```
Missing keys in en-US:
  - dashboard.cards.newCard.title
  - settings.appearance.theme
```

## CI/CD - GitHub Actions

O projeto está configurado com GitHub Actions para rodar os testes automaticamente em:

- Push para branches `main` e `develop`
- Pull Requests para `main` e `develop`

O workflow inclui:

1. **Job `test`**: Roda todos os testes e o linter
2. **Job `i18n-validation`**: Roda especificamente a validação de i18n

Veja o arquivo `.github/workflows/test.yml` para mais detalhes.

## Adicionando Novos Testes

Para adicionar novos testes, crie arquivos com o padrão `*.test.ts` ou `*.test.tsx` neste diretório.

Exemplo:

```typescript
import { describe, it, expect } from 'vitest'

describe('Meu Teste', () => {
  it('deve fazer algo', () => {
    expect(1 + 1).toBe(2)
  })
})
```

## Coverage

Para gerar relatório de cobertura de código:

```bash
npm test -- --coverage
```

O relatório será gerado em `coverage/index.html`.

## Troubleshooting

### Erro: "Cannot find module"

Certifique-se de que rodou `npm install` antes de executar os testes.

### Testes falhando localmente mas passando no CI

Verifique se você está usando a mesma versão do Node.js do CI (20.x).

### Erro de importação dos locales

Os arquivos de locale devem exportar objetos nomeados (`export const ptBR = ...`).

