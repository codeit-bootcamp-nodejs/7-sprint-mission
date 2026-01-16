import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/usersRepository.js';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export const authService = {
  async register(data: any) {
    const isExist = await userRepository.findByEmail(data.email);
    if (isExist) throw new BadRequestError('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // DTO - 필요한 정보만
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new BadRequestError('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestError('Invalid credentials');

    return generateTokens(user.id);
  },

  async refresh(token: string) {
    const { userId } = verifyRefreshToken(token);
    const user = await userRepository.findById(userId);

    if (!user) throw new BadRequestError('Invalid refresh token');

    return generateTokens(userId);
  },
};
