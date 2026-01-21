import { User } from '@prisma/client';
import { UserCreateData } from '../../dtos/authDtos.js';
import { UserUpdateData } from '../../dtos/userDtos.js';

export interface IUserRepository {
  create(data: UserCreateData): Promise<User>;
  
  findById(id: number): Promise<User | null>;
  
  findByEmail(email: string): Promise<User | null>;
  
  update(id: number, data: UserUpdateData): Promise<User>;
  
  updatePassword(id: number, hashedPassword: string): Promise<User>;
}
