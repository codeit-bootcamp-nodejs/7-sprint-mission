import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { PrismaClient } = require("../generated/prisma/index.js");

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pkg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: [
    // 쿼리(SQL)를 콘솔에 출력합니다.
    "query",
    // (선택 사항) 일반 정보, 경고, 오류도 함께 출력할 수 있습니다.
    // 'info',
    // 'warn',
    // 'error',
  ],
});

export { prisma };
