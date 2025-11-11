#!/bin/bash
set -e

echo "🧹 Limpando o ambiente Prisma..."

# Remover dependências e migrações antigas
rm -rf node_modules
rm -f package-lock.json
rm -rf prisma/migrations

echo "📦 Reinstalando dependências..."
npm install

echo "⬆️ Atualizando Prisma para a última versão..."
npm install --save-dev prisma@latest
npm install @prisma/client@latest

echo "⚙️ Gerando Prisma Client..."
npx prisma generate

echo "💣 Resetando banco de dados (todas as tabelas serão apagadas)..."
npx prisma migrate reset --force

echo "🚀 Criando e aplicando migração inicial..."
npx prisma migrate dev --name init

echo "✅ Prisma atualizado, banco sincronizado e client regenerado com sucesso."
