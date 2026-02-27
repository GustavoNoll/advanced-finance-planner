# Revisão dos Cálculos Financeiros — lib/calculations

**Revisor:** Perspectiva de matemático e especialista em finanças  
**Data:** 2025-02-17  
**Última atualização:** 2025-02-17  
**Escopo:** `packages/frontend/src/lib/calculations/`

- `chart-projections.ts` — projeções mensais/anuais para gráficos
- `financial-goals-processor.ts` — processamento de goals e events (parcelas, links)
- `investmentPlanCalculations.ts` — cálculos de FV, PV, PMT para planos e micro-planos
- `plan-progress-calculator.ts` — progresso do plano, comparação planejado vs. projetado

---

## Sumário Executivo

A base de cálculos está bem estruturada e cobre cenários complexos (multi‑moeda, inflação histórica vs. projetada, múltiplos micro-planos). Foram aplicadas diversas correções. Este documento mantém apenas os itens pendentes e novas observações da re-análise.

---

## 1. Erros e bugs pendentes

### 1.1 Tratamento de `events` com valor negativo em `calculateRemainingAmount`

**Arquivo:** `financial-goals-processor.ts`  

**Problema:** Uso de `Math.abs(link.allocated_amount)` ignora o sinal em events negativos (despesas). O valor restante pode ficar incorreto.

**Impacto:** Médio — events negativos podem ser tratados incorretamente.

---

## 2. Pontos conceituais e de modelagem financeira

### 2.1 Taxa de retorno nominal vs. real

**Contexto:** `calculateMonthlyRates` em `chart-projections.ts`.

**Observação:** Assumir retorno nominal como (1+r)(1+i)−1 é consistente quando r e i são independentes. Documentar qual convenção é usada.

---

### 2.2 Plano tipo 3 (Legado/perpetuidade)

**Arquivo:** `plan-progress-calculator.ts`  

**Problema conceitual:** Com `adjust_income_for_inflation = false`, a fórmula atual pode superestimar o saque. O usual para perpetuidade crescente é W = PV × (r − g) em termos reais.

---

### 2.3 `investmentPlanCalculations`: necessaryFutureValue no tipo 1

**Arquivo:** `investmentPlanCalculations.ts`  

**Observação:** `inflationAdjustedIncome / monthExpectedReturnRate` dá capital para perpetuidade nominal. O tipo 1 (“encerrar”) usa anuidade finita em `presentValue`; `necessaryFutureValue` assume perpetuidade — verificar se a dualidade é intencional.

---

## 3. Inflação

### 3.1 CPI e período de referência

**Arquivo:** `inflation-utils.ts`  

Verificar alinhamento de chaves `YYYY-M` e datas da API (UTC/local, fechamento do IPCA).

---

### 3.2 Fallback de inflação

**Arquivos:** `chart-projections.ts`, `plan-progress-calculator.ts`  

Documentar critério de fallback quando não há CPI e, se viável, sinalizar na UI.

---

## 4. Organização e estrutura

### 4.1 Tamanho dos arquivos

| Arquivo                         | Linhas |
|---------------------------------|--------|
| chart-projections.ts            | ~1231  |
| plan-progress-calculator.ts     | ~1436  |
| investmentPlanCalculations.ts   | ~247   |
| financial-goals-processor.ts    | ~177   |

**Sugestão:** Modularizar os maiores (ex.: projection-loop, retirement-income, plan-progress-steps).

---

## 5. Otimizações

### 5.1 `initialRecords.sort` em `createProjectionContext` ✅ Corrigido

**Arquivo:** `chart-projections.ts`  

**Correção aplicada:** Usar `[...initialRecords].sort(...)` uma vez, armazenar em `sortedByDateForFirst`, e reutilizar para `firstHistoricalRecordDate`.

---

### 5.2 Mutação de `allFinancialRecords.sort` em `plan-progress-calculator` ✅ Corrigido

**Arquivo:** `plan-progress-calculator.ts`  

**Correção aplicada:** Ordenar cópia com `[...allFinancialRecords].sort(...)` para evitar mutar o array do caller.

---

### 5.3 `iterateMonthlyValues` e alocação

**Arquivo:** `plan-progress-calculator.ts`  

Avaliar atalhos analíticos para períodos longos quando apenas totais ou taxas agregadas forem necessárias.

---

### 5.4 Mapas de CPI

Considerar cache por `(startDate, endDate, currency)` para reduzir chamadas repetidas.

---

## 6. Qualidade de código

### 6.1 `console.log` em produção

**Arquivos:** `plan-progress-calculator.ts`  

Muitos `console.log`/`console.group` executam em produção.

**Sugestão:** Usar logger condicional (ex.: `if (__DEV__)`) ou biblioteca de logging com níveis.

---

## 7. Testes e validação

### 7.1 Casos de borda

- Plano sem registros financeiros.
- `initialRecords` vazio ou com um único registro.
- Goals/events no mês exato de aposentadoria.
- `expectedReturn` ou `inflation` zero.
- `monthsInRetirement` zero ou negativo.
- Plano tipo 2 com/sem herança.

---

### 7.2 Consistência entre módulos

Testes de integração entre `chart-projections`, `plan-progress-calculator` e `investmentPlanCalculations` para garantir que mesmos inputs produzam resultados coerentes em balanço e renda.

---

## 8. Priorização de melhorias

| Prioridade | Item                                               | Arquivo                    | Esforço | Impacto |
|-----------|-----------------------------------------------------|----------------------------|---------|---------|
| Alta      | 1.1 Events negativos                                | financial-goals-processor  | Médio   | Médio   |
| Média     | 2.2 Plano tipo 3 perpetuidade                      | plan-progress-calculator   | Médio   | Médio   |
| Baixa     | 6.1 Remover console em produção                    | plan-progress-calculator   | Baixo   | Baixo   |
| Baixa     | 4.1 Modularizar arquivos grandes                   | chart-projections, plan-progress | Alto | Baixo   |

---

## 9. Conclusão

Após aplicação das correções anteriores (1.1–1.10, 2.3, 3.3, 4.1–4.2, 6.2–6.3), os pontos mais relevantes pendentes são:

1. Tratamento de events negativos em `calculateRemainingAmount`.
2. Revisão conceitual do plano tipo 3 (perpetuidade vs. nominal).
3. Remoção ou condicionalização de `console` em produção.
