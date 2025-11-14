FROM node:20-slim as deps

WORKDIR /app

# Instalar dependências nativas necessárias para o Prisma
RUN apt-get update -y \
  && apt-get install -y openssl libssl-dev ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-slim as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma precisa do OpenSSL também nesta fase
RUN apt-get update -y \
  && apt-get install -y openssl libssl-dev ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN npx prisma generate
RUN npm run build

FROM node:20-slim as runner
WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "start"]
