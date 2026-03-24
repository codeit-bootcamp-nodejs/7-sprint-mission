FROM node:24 AS builder

WORKDIR /build
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build


FROM node:24 AS runner

WORKDIR /app
COPY --from=builder /build/package.json ./
COPY --from=builder /build/build ./build
COPY --from=builder /build/prisma ./prisma

ENV BASE_URL=http://localhost:3000
ENV PORT=3000
EXPOSE 3000
VOLUME /app/public

CMD ["sh", "-c","npx prisma migrate deploy && npm run start"]