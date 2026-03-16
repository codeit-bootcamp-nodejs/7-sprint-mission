import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository';
import BadRequestError from '../lib/errors/BadRequestError';

type CreatedUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export async function register(data: CreatedUserData) {
  // Registration logic here
  const { email, nickname, password } = data;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const isExist = await userRepository.getUserWithEmail(email);
  if (isExist) {
    throw new BadRequestError('User already exists');
  }

  const user = await userRepository.createUser({
    email, nickname, password: hashedPassword
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function login(email: string, password: string) {
  const user = await userRepository.loginUser(email);
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials');
  }
  return user;
}
export async function refreshUserToken(userId: number) {
  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new BadRequestError('Invalid user');
  }
  return user;
}

export async function verifyAccessToken(accessToken: string) {
  try {
    const decoded = Buffer.from(accessToken, 'base64').toString('utf-8');
    const userId = parseInt(decoded, 10);
    if (isNaN(userId)) {
      throw new BadRequestError('Invalid access token');
    }
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return true;
  } catch (error) {
    throw new BadRequestError('Invalid access token');
  }
} 