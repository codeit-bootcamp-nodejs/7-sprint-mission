export function validatePost(req, res, next) {
  const { title, content } = req.query;
  if (!title) {
    return res.status(400).json({ message: "title을 입력해주세요." });
  }
  if (!content) {
    return res.status(400).json({ message: "content를 입력해주세요." });
  }

  next();
}

export function validateGet(req, res, next) {
  const { title, content, createdAt, orderBy } = req.query;
  const validateData = {};

  if (title) validateData.title = { contains: title, mode: "insensitive" };
  if (content)
    validateData.content = { contains: content, mode: "insensitive" };
  if (createdAt) validateData.createdAt = createdAt;

  req.validateData =
    Object.keys(validateData).length === 0 ? undefined : validateData;
  req.orderBy = orderBy;
  next();
}
