# 빌드 스테이지 
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl
COPY sprint11/package*.json ./
RUN npm ci

COPY sprint11/ .

# Prisma 타입 생성 및 TypeScript 컴파일
RUN npx prisma generate
RUN npx tsc

# 실행 스테이지 
FROM node:20-alpine AS runner
WORKDIR /app

# Prisma 실행에 필수인 openssl 및 관련 라이브러리 설치
RUN apk add --no-cache openssl libc6-compat

# 보안 설정: root가 아닌 일반 사용자 생성
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 의존성 설치
COPY sprint11/package*.json ./
RUN npm ci --only=production

# 빌드 스테이지에서 컴파일된 결과물만 가져오기
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# 업로드 폴더 권한 설정 및 볼륨 준비
RUN mkdir -p /app/public && chown -R appuser:appgroup /app /app/public
# 생성한 일반 사용자로 전환
USER appuser

EXPOSE 3000

# Prisma 마이그레이션 적용 후 서버 실행
CMD ["sh", "-c", "npx prisma migrate deploy && node ./dist/main.js"]