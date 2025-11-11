#!/bin/bash
set -e

# Cores
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
BLUE="\033[1;34m"
RED="\033[1;31m"
RESET="\033[0m"

echo -e "${BLUE}🧹 Limpando o ambiente Prisma...${RESET}"
rm -rf node_modules
rm -f package-lock.json
rm -rf prisma/migrations

echo -e "${YELLOW}📦 Reinstalando dependências...${RESET}"
npm install

echo -e "${YELLOW}⬆️  Atualizando Prisma para a última versão...${RESET}"
npm install --save-dev prisma@latest
npm install @prisma/client@latest

echo -e "${GREEN}⚙️  Gerando Prisma Client...${RESET}"
npx prisma generate

echo -e "${RED}💣 Resetando banco de dados (todas as tabelas serão apagadas)...${RESET}"
npx prisma migrate reset --force

echo -e "${BLUE}🚀 Criando e aplicando migração inicial...${RESET}"
npx prisma migrate dev --name init

echo -e "${GREEN}✅ Prisma atualizado, banco sincronizado e client regenerado com sucesso.${RESET}"
