import pkg from "pg";
import { PrismaClient } from "../generated/prisma/index.js";

const pool = new pkg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient();
