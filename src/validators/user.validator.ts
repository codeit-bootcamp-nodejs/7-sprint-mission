export function validateUpdateUser(body: Record<string, unknown>): string | null {
  if (body.nickname !== undefined && typeof body.nickname !== 'string') return 'nickname must be a string';
  if (body.image !== undefined && typeof body.image !== 'string') return 'image must be a string';
  return null;
}

export function validateChangePassword(body: Record<string, unknown>): string | null {
  if (!body.currentPassword || typeof body.currentPassword !== 'string') return 'currentPassword is required';
  if (!body.newPassword || typeof body.newPassword !== 'string') return 'newPassword is required';
  if ((body.newPassword as string).length < 8) return 'newPassword must be at least 8 characters';
  return null;
}
