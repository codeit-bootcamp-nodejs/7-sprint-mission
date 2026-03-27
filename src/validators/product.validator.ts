export function validateCreateProduct(body: Record<string, unknown>): string | null {
  if (!body.name || typeof body.name !== 'string') return 'name is required';
  if (!body.description || typeof body.description !== 'string') return 'description is required';
  if (body.price === undefined || typeof body.price !== 'number') return 'price must be a number';
  if (body.price < 0) return 'price must be non-negative';
  return null;
}

export function validateUpdateProduct(body: Record<string, unknown>): string | null {
  if (body.price !== undefined && typeof body.price !== 'number') return 'price must be a number';
  if (body.price !== undefined && (body.price as number) < 0) return 'price must be non-negative';
  return null;
}
