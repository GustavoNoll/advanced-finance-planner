# Calculadora de Rentabilidade

Este componente fornece uma interface para calcular rentabilidade de ativos financeiros. Ele está integrado tanto na aba **Consolidado** quanto na aba **Detalhados** da página de gerenciamento de dados de performance.

## Como Funciona

A calculadora possui dois modos:

1. **Modo Simples**: Permite inserir diretamente a rentabilidade mensal em percentual
2. **Modo Avançado**: Permite calcular rentabilidade baseada em indexadores (CDI, IPCA, Pré-fixado, Manual)

## Integração Atual

A calculadora está integrada nos seguintes pontos:

- **Aba Consolidado**: Botão de calculadora ao lado do campo "Rendimento (%)"
- **Aba Detalhados**: Botão de calculadora ao lado do campo "Rendimento (%)"

Quando o usuário clica no botão da calculadora, ela abre um dialog modal com os campos de cálculo.

## Como Integrar a Calculadora do Seu Amigo

Para integrar a calculadora completa do seu amigo, siga estes passos:

### 1. Substituir a Lógica de Cálculo

No arquivo `src/components/performance/YieldCalculator.tsx`, localize a função `handleCalculate()` e substitua a lógica do modo avançado:

```typescript
// Localize esta seção (aproximadamente linha 60-90)
if (calculationMode === 'advanced') {
  // TODO: Substituir esta lógica pela calculadora do seu amigo
  let monthlyYield = 0
  
  if (advancedIndexer === 'MANUAL') {
    monthlyYield = percentage / 100
  } else {
    // Lógica simplificada - substituir pela calculadora real
    monthlyYield = percentage / 100
  }
  
  // ... resto do código
}
```

### 2. Importar a Calculadora Externa

Se a calculadora do seu amigo for um componente React separado:

```typescript
import { CalculatorFromFriend } from '@/path/to/friend/calculator'

// Então use o componente dentro do modo avançado
{calculationMode === 'advanced' && (
  <CalculatorFromFriend
    initialValue={parseFloat(advancedInitialValue)}
    period={advancedPeriod}
    indexer={advancedIndexer}
    onCalculate={(result) => {
      // Processar resultado
    }}
  />
)}
```

### 3. Se a Calculadora For uma Função

Se a calculadora do seu amigo for uma função JavaScript:

```typescript
import { calculateYield } from '@/path/to/friend/calculator'

// No handleCalculate, substitua:
if (calculationMode === 'advanced') {
  const result = calculateYield({
    initialValue: parseFloat(advancedInitialValue),
    period: advancedPeriod,
    indexer: advancedIndexer,
    percentage: parseFloat(advancedPercentage),
    operation: advancedOperation
  })
  
  // result deve retornar { monthlyYield, finalValue?, financialGain? }
  result.monthlyYield = result.monthlyYield // já em decimal
  // ... resto do código
}
```

### 4. Manter a Interface

Certifique-se de que a calculadora do seu amigo retorne um objeto compatível com `YieldCalculationResult`:

```typescript
interface YieldCalculationResult {
  monthlyYield: number      // Rentabilidade mensal em decimal (ex: 0.015 para 1.5%)
  finalValue?: number       // Valor final calculado (opcional)
  financialGain?: number    // Ganho financeiro calculado (opcional)
  metadata?: Record<string, any>  // Dados adicionais (opcional)
}
```

### 5. Testar a Integração

Após integrar:

1. Abra a página de gerenciamento de dados
2. Clique em "Novo" ou "Editar" em qualquer registro
3. Clique no botão da calculadora ao lado do campo "Rendimento (%)"
4. Teste ambos os modos (Simples e Avançado)
5. Verifique se os valores são preenchidos corretamente nos campos

## Estrutura do Componente

```
YieldCalculator.tsx
├── Props Interface (YieldCalculatorProps)
├── Result Interface (YieldCalculationResult)
├── Estados do Componente
│   ├── calculationMode (simples/avançado)
│   ├── Estados do modo simples
│   └── Estados do modo avançado
├── handleCalculate() - Função principal de cálculo
└── JSX - Interface do usuário
```

## Personalização

Você pode personalizar a calculadora adicionando:

- Novos modos de cálculo
- Novos indexadores
- Validações adicionais
- Integração com APIs externas
- Cálculos mais complexos

Basta modificar o componente `YieldCalculator.tsx` conforme necessário.


