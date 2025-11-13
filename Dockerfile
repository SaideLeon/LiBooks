# --------------------------
# Stage 1: Dependências
# --------------------------
    FROM node:20-alpine AS deps

    # Instala OpenSSL (necessário para Prisma)
    RUN apk add --no-cache openssl
    
    WORKDIR /app
    
    COPY package.json package-lock.json ./
    
    # Instala dependências
    RUN npm ci
    
    # --------------------------
    # Stage 2: Builder
    # --------------------------
    FROM node:20-alpine AS builder
    
    # Instala OpenSSL também neste estágio (para o prisma generate)
    RUN apk add --no-cache openssl
    
    WORKDIR /app
    
    # Copia node_modules do estágio anterior
    COPY --from=deps /app/node_modules ./node_modules
    
    # Copia o restante do projeto
    COPY . .
    
    # Garante variáveis de ambiente seguras (defina no Coolify)
    ENV NODE_ENV=production
    
    # Gera o Prisma Client e builda o Next.js
    RUN npx prisma generate && npm run build
    
    # --------------------------
    # Stage 3: Runner
    # --------------------------
    FROM node:20-alpine AS runner
    
    # Cria diretório da aplicação
    WORKDIR /app
    
    # Copia apenas o necessário para rodar em produção
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/prisma ./prisma
    
    ENV NODE_ENV=production
    ENV PORT=3002
    
    # Expondo porta padrão
    EXPOSE 3002
    
    # Comando de inicialização
    CMD ["npm", "run", "start"]
    