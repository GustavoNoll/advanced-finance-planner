#!/bin/sh

echo "🚀 Iniciando atualização dos indicadores econômicos..."

# Garante que está na raiz do projeto
cd "$(dirname "$0")"

# Verifica se node_modules existe, se não, instala dependências
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependências..."
  npm install
fi

# Executa o script TypeScript
echo "🔄 Buscando dados do BCB (IPCA, CDI, IBOV)..."
npx tsx scripts/fetch-indicators/fetch-indicators.ts
echo "🔄 Buscando dados do FRED..."
npx tsx scripts/fetch-indicators/fetch-us-indicators.ts
echo "🔄 Buscando dados do ECB..."
npx tsx scripts/fetch-indicators/fetch-euro-indicators.ts
echo "🔄 Buscando dados do Yahoo Finance (PTAX)..."
npx tsx scripts/fetch-indicators/fetch-yahoo-finance.ts
echo "🔄 Baixando e processando indicadores de arquivos XLS..."
npx tsx scripts/fetch-indicators/fetch-xls-indicators.ts

echo "✅ Dados atualizados com sucesso!" 