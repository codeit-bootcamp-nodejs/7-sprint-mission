export function validateProduct(req, res, next) {
  const { name, description, price, tags } = req.body;

  if (!name || !description || price === undefined) {
    return res.status(400).json({
      error: "name, description, price는 필수 입력값입니다.",
    });
  }

  if (typeof name !== "string" || name.trim().length < 1)
    return res
      .status(400)
      .json({ error: "name은 1자 이상 문자열이어야 합니다." });

  if (typeof description !== "string" || description.trim().length < 1)
    return res
      .status(400)
      .json({ error: "description은 1자 이상 문자열이어야 합니다." });

  const priceNumber = Number(price);
  if (isNaN(priceNumber) || priceNumber < 0)
    return res.status(400).json({ error: "price는 0 이상의 숫자여야 합니다." });

  if (tags && typeof tags !== "string")
    return res
      .status(400)
      .json({ error: "tags는 콤마(,)로 구분된 문자열이어야 합니다." });

  next();
}
