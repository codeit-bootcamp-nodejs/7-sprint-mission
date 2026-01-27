import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';

const connectionString : string = process.env.DATABASE_URL || '';
const pool = new pkg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({
  adapter,
  log: ['query'],
});
