#!/bin/bash

echo "🔄 Sincronizando funções do backend para api/..."

# Criar o diretório api/ na raiz se não existir
mkdir -p api

# Copiar todos os arquivos .ts da pasta packages/backend/api para a pasta api/ na raiz
cp packages/backend/api/*.ts api/

echo "✅ Funções sincronizadas!"
echo "📁 Funções disponíveis em:"
ls -la api/
