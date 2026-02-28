# Revisão dos Cálculos Financeiros — lib/calculations

**Revisor:** Perspectiva de matemático e especialista em finanças  
**Data:** 2025-02-17  
**Última re-análise:** 2025-02-17  
**Escopo:** `packages/frontend/src/lib/calculations/`

- `chart-projections.ts` — projeções mensais/anuais para gráficos
- `financial-goals-processor.ts` — processamento de goals e events (parcelas, links)
- `investmentPlanCalculations.ts` — cálculos de FV, PV, PMT para planos e micro-planos
- `plan-progress-calculator.ts` — progresso do plano, comparação planejado vs. projetado

---

## Sumário Executivo

A base de cálculos está estruturada e cobre cenários complexos (multi-moeda, inflação histórica vs. projetada, múltiplos micro-planos). Este documento lista itens pendentes e observações da re-análise.

---

## 1. Pontos conceituais e modelagem financeira

### 1.1 Taxa de retorno nominal vs. real

**Contexto:** `calculateMonthlyRates` em `chart-projections.ts`.

**Observação:** Assumir retorno nominal como (1+r)(1+i)−1 é consistente quando r e i são independentes. Documentar qual convenção é usada.

---

### 1.2 Plano tipo 3 (Legado/perpetuidade)

**Arquivo:** `plan-progress-calculator.ts`

**Problema conceitual:** Com `adjust_income_for_inflation = false`, a fórmula atual pode superestimar o saque. O usual para perpetuidade crescente é W = PV × (r − g) em termos reais.

---

### 1.3 `investmentPlanCalculations`: necessaryFutureValue no tipo 1

**Arquivo:** `investmentPlanCalculations.ts`

**Observação:** `inflationAdjustedIncome / monthExpectedReturnRate` dá capital para perpetuidade nominal. O tipo 1 ("encerrar") usa anuidade finita em `presentValue`; `necessaryFutureValue` assume perpetuidade — verificar se a dualidade é intencional.

---

## 2. Inflação

### 2.1 CPI e período de referência

**Arquivo:** `inflation-utils.ts`

Verificar alinhamento de chaves `YYYY-M` (ou `YYYY-MM`) e datas da API (UTC/local, fechamento do IPCA).

---

### 2.2 Fallback de inflação

**Arquivos:** `chart-projections.ts`, `plan-progress-calculator.ts`

Documentar critério de fallback quando não há CPI e, se viável, sinalizar na UI.

---

## 3. Organização e estrutura

### 3.1 Tamanho dos arquivos

| Arquivo                         | Linhas |
|---------------------------------|--------|
| chart-projections.ts            | ~1231  |
| plan-progress-calculator.ts     | ~1436  |
| investmentPlanCalculations.ts   | ~247   |
| financial-goals-processor.ts    | ~188   |

**Sugestão:** Modularizar os maiores (ex.: projection-loop, retirement-income, plan-progress-steps).

---

## 4. Otimizações

### 4.1 `iterateMonthlyValues` e alocação

**Arquivo:** `plan-progress-calculator.ts`

Avaliar atalhos analíticos para períodos longos quando apenas totais ou taxas agregadas forem necessárias.

---

### 4.2 Mapas de CPI

Considerar cache por `(startDate, endDate, currency)` para reduzir chamadas repetidas.

---

## 5. Qualidade de código

### 5.1 `console.log` em produção

**Arquivo:** `plan-progress-calculator.ts`

Há muitos `console.log`/`console.group`/`console.warn` executando em produção.

**Sugestão:** Usar logger condicional (ex.: `if (__DEV__)`) ou biblioteca de logging com níveis.

---

## 6. Priorização de melhorias

| Prioridade | Item                                | Arquivo                    | Esforço | Impacto |
|-----------|--------------------------------------|----------------------------|---------|---------|
| Média     | 1.2 Plano tipo 3 perpetuidade       | plan-progress-calculator   | Médio   | Médio   |
| Baixa     | 5.1 Remover console em produção     | plan-progress-calculator   | Baixo   | Baixo   |
| Baixa     | 3.1 Modularizar arquivos grandes    | chart-projections, plan-progress | Alto | Baixo   |

---

## 7. Conclusão

Principais pendentes:

1. Revisão conceitual do plano tipo 3 (perpetuidade vs. nominal) (1.2)
2. Remoção ou condicionalização de `console` em produção (5.1)
