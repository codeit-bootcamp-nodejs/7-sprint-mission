import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// 환경변수 체크
const connectionString = process.env.DATABASE_URL;

// 어댑터 설정 (v7 버전에서는 이 방식이 가장 안정적입니다)
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

if (!BigInt.prototype.toJSON) {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
}

export default prisma;
