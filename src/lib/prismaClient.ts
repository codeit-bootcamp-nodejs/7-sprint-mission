import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { DATABASE_URL } from "./constants";

const pool = new pg.Pool({ connectionString: DATABASE_URL });

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};