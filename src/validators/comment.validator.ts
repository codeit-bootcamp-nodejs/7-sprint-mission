export function validateCreateComment(body: Record<string, unknown>): string | null {
  if (!body.content || typeof body.content !== 'string') return 'content is required';
  if (body.content.trim().length === 0) return 'content cannot be empty';
  return null;
}

export function validateUpdateComment(body: Record<string, unknown>): string | null {
  if (!body.content || typeof body.content !== 'string') return 'content is required';
  if (body.content.trim().length === 0) return 'content cannot be empty';
  return null;
}
