import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository';
import {  RegisterBody, LoginBody } from '../structs/authStruct';
import BadRequestError from '../lib/errors/BadRequestError';
import { generateTokens } from '../lib/token';

export const authService = {
  async register(data: RegisterBody) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) throw new BadRequestError('이미 사용 중인 이메일입니다.');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({ ...data, password: hashedPassword });
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async login(data: LoginBody) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) throw new BadRequestError('이메일을 찾을 수 없습니다.');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new BadRequestError('비밀번호가 일치하지 않습니다.');

    const tokens = generateTokens(user.id);
    const { password: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, ...tokens };
  }
};