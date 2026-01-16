import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { UserResponse, TokenPair } from '../dtos/authDtos.js';
import { RegisterInput, LoginInput } from '../schemas/authSchemas.js';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(data: RegisterInput): Promise<UserResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.userRepository.create({
      email: data.email,
      nickname: data.nickname,
      password: hashedPassword,
      image: null,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginInput): Promise<{ tokens: TokenPair; user: User }> {
    const user = await this.userRepository.findByEmail(data.email);
    
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    const tokens = generateTokens(user.id);

    return { tokens, user };
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    if (!refreshToken) {
      throw new BadRequestError('Invalid refresh token');
    }

    const { userId } = verifyRefreshToken(refreshToken);

    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new BadRequestError('Invalid refresh token');
    }

    return generateTokens(userId);
  }
}
