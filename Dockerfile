# Stage 1: Dependências
FROM node:20-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Stage 2: Builder
FROM node:20-slim AS builder

WORKDIR /app

# Copia dependências instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copia restante do código
COPY . .

ENV NODE_ENV=production

# Gera Prisma Client + Build Next.js
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3002

CMD ["npm", "run", "start"]
