import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

// 1. PostgreSQL 커넥션 풀 설정
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });

// 2. 드라이버 어댑터 설정 (PostgreSQL 환경 최적화)
const adapter = new PrismaPg(pool);

// 3. Prisma Client 인스턴스 생성
// BigInt를 사용하므로 로그를 켜서 쿼리 흐름을 보는 것이 좋습니다.
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

// 4. BigInt JSON 변환 에러 방지 설정 (필수)
if (!BigInt.prototype.toJSON) {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
}

export default prisma;
