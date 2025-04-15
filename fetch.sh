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
echo "🔄 Buscando dados do BCB..."
npx tsx fetch-indicators.ts
echo "🔄 Buscando dados do FRED..."
npx tsx fetch-us-indicators.ts
echo "🔄 Buscando dados do ECB..."
npx tsx fetch-euro-indicators.ts

echo "✅ Dados atualizados com sucesso!" 