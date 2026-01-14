import * as authService from "../services/authService.js";

export const register = async (req, res) => {
  const { email, nickname, password } = req.body;
  const result = await authService.register({ email, nickname, password });
  res.status(201).json(result);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.json(result);
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refresh(refreshToken);
  res.json(result);
};