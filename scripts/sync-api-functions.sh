#!/bin/bash

set -e  # Exit on error

echo "🔄 Sincronizando funções do backend para api/..."

# Criar o diretório api/ na raiz se não existir
mkdir -p api

# Limpar funções antigas (opcional, mas ajuda a evitar problemas)
# rm -f api/*.ts

# Copiar todos os arquivos .ts da pasta packages/backend/api para a pasta api/ na raiz
if [ ! -d "packages/backend/api" ]; then
  echo "❌ Erro: packages/backend/api não encontrado!"
  exit 1
fi

if [ -z "$(ls -A packages/backend/api/*.ts 2>/dev/null)" ]; then
  echo "⚠️  Aviso: Nenhum arquivo .ts encontrado em packages/backend/api/"
else
  cp packages/backend/api/*.ts api/
  echo "✅ Funções sincronizadas!"
  echo "📁 Funções disponíveis em:"
  ls -la api/
fi
