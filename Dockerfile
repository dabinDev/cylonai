FROM node:24-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./
RUN npm ci --ignore-scripts

FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
ARG DATABASE_URL=mysql://root:placeholder@mysql-dabin:3306/cylonai
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat openssl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/app/generated ./app/generated
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
