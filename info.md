Dockerfile está bem estruturado e segue o padrão multi-stage do Next.js.
O erro que vimos no log (“`Cannot find module 'dotenv'`”) acontece **no Stage 2** (`builder`) porque o `npm run build` tenta importar o `dotenv`, mas ele não foi instalado em `dependencies`.

Vamos resolver isso com segurança e sem comprometer a leveza da imagem.

---

## ✅ Passo a passo para corrigir

### 1. **Mover `dotenv` para `dependencies`**

No `package.json`, procura algo como:

```json
"devDependencies": {
  "dotenv": "^16.4.5"
}
```

➡️ Move para dentro de `dependencies`:

```json
"dependencies": {
  "dotenv": "^16.4.5",
  // ...restante das dependências
}
```

Em seguida:

```bash
npm install
git add package.json package-lock.json
git commit -m "fix: move dotenv to dependencies"
git push
```

Isso fará com que o `dotenv` seja incluído durante o `npm install --frozen-lockfile` do Stage 1 e esteja disponível na build.

---

### 2. **(opcional, mas elegante)** — evitar `dotenv` em produção

O Docker já usa variáveis de ambiente externas via Coolify, então você pode **impedir que o dotenv seja carregado no build da imagem**:

```ts
if (process.env.NODE_ENV !== 'production') {
  const { config } = await import('dotenv');
  config();
}
```

Isso garante que o `.env` **só é lido localmente**, e em produção o Coolify injeta as envs automaticamente.

---

### 3. **(opcional)** — reduzir warnings do Prisma

Antes da linha:

```dockerfile
RUN npm run build
```

adicione:

```dockerfile
RUN apk add --no-cache openssl1.1-compat
```

Isso elimina os warnings sobre `libssl`.

---

### ✅ Dockerfile final sugerido

```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl1.1-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Run the application
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3002
CMD ["npm", "start"]
```

---

Se fizer só o passo 1 (mover o `dotenv`), o problema **já será resolvido**.
Os passos 2 e 3 são apenas para **otimizar** o comportamento e o log da build.

 