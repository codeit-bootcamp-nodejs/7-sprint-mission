import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient.js';
import { Request, Response } from 'express';
import { create } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { CreateRegisterBodyStruct, CreateRegisterBody } from '../structs/authStruct.js';

export async function createRegister(req: Request, res: Response) {
  const { email, nickname, password } = create(
    req.body,
    CreateRegisterBodyStruct,
  ) as CreateRegisterBody;

  const existingEmail = await prismaClient.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw new BadRequestError(`이미 사용중인 이메일입니다.`);
  }
  const existingNickname = await prismaClient.user.findUnique({ where: { nickname } });
  if (existingNickname) {
    throw new BadRequestError(`이미 사용중인 닉네임입니다.`);
  }
  //비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prismaClient.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
      image: '',
    },
  });
  const { password: _, ...userWithoutPassword } = newUser;
  return res.status(201).json(userWithoutPassword);
}
