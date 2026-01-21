import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = (plain: string): Promise<string> =>
    bcrypt.hash(plain, SALT_ROUNDS);

export const verifyPassword = (plain: string, hashed: string): Promise<boolean> =>
    bcrypt.compare(plain, hashed);