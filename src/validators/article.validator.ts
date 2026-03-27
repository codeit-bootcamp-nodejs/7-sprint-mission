export function validateCreateArticle(body: Record<string, unknown>): string | null {
  if (!body.title || typeof body.title !== 'string') return 'title is required';
  if (!body.content || typeof body.content !== 'string') return 'content is required';
  return null;
}

export function validateUpdateArticle(body: Record<string, unknown>): string | null {
  if (body.title !== undefined && typeof body.title !== 'string') return 'title must be a string';
  if (body.content !== undefined && typeof body.content !== 'string') return 'content must be a string';
  return null;
}
