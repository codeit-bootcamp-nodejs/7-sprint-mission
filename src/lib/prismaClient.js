import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { PrismaClient } = require("@prisma/client");

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined in environment variables.");
  process.exit(1);
}
const pool = new pkg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export { prisma };