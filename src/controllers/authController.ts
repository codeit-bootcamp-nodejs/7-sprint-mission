import type { Request, Response } from "express";
import * as authService from "../services/authService.js";
import { string } from "../../utils/validation.js";

import type { RegisterDto, LoginDto, RefreshDto } from "../dtos/auth.dto.js";

type AnyBody = Record<string, unknown>;

export const register = async (req: Request<unknown, unknown, AnyBody>, res: Response) => {
  const dto: RegisterDto = {
    email: string(req.body.email),
    nickname: string(req.body.nickname),
    password: string(req.body.password),
  };

  res.status(201).json(await authService.register(dto));
};

export const login = async (req: Request<unknown, unknown, AnyBody>, res: Response) => {
  const dto: LoginDto = {
    email: string(req.body.email),
    password: string(req.body.password),
  };

  res.status(200).json(await authService.login(dto));
};

export const refresh = async (req: Request<unknown, unknown, AnyBody>, res: Response) => {
  const dto: RefreshDto = {
    refreshToken: string(req.body.refreshToken),
  };

  res.status(200).json(await authService.refresh(dto));
};
