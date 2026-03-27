export function validateRegister(body: Record<string, unknown>): string | null {
  if (!body.email || typeof body.email !== 'string') return 'email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return 'Invalid email format';
  if (!body.password || typeof body.password !== 'string') return 'password is required';
  if (body.password.length < 8) return 'password must be at least 8 characters';
  if (!body.nickname || typeof body.nickname !== 'string') return 'nickname is required';
  return null;
}

export function validateLogin(body: Record<string, unknown>): string | null {
  if (!body.email || typeof body.email !== 'string') return 'email is required';
  if (!body.password || typeof body.password !== 'string') return 'password is required';
  return null;
}
