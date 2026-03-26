FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npx tsc

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p /app/public && chown -R appuser:appgroup /app /app/public
USER appuser

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node ./dist/main.js"]