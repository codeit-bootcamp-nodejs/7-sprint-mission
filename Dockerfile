# 베이스 이미지
FROM node:22-slim

# 작업 디렉토리 설정
WORKDIR /app

# openssl 설치 (Prisma 필요)
RUN apt-get update -y && apt-get install -y openssl

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스코드 복사
COPY . .

# Prisma 클라이언트 생성
RUN npx prisma generate

# TypeScript 빌드
RUN npm run build

# 업로드 폴더 생성
RUN mkdir -p /app/public

# 포트 노출
EXPOSE 3000

# 마이그레이션 후 서버 실행
CMD ["sh", "-c", "npx prisma migrate deploy && node ./build/main.js"]