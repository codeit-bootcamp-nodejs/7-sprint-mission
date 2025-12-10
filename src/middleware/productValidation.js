export function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID: must be a number" });
  }
  next();
}
