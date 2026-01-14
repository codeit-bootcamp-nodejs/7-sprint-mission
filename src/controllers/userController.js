import * as userService from "../services/userService.js";
import { User } from "../constructors/user.js";
import { Product } from "../constructors/product.js";
import { Article } from "../constructors/article.js";

export const user = async (req, res) => {
  const userId = req.user.id;
  const entity = await userService.getUser(userId);
  res.json(User.fromEntity(entity));
};

export const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { nickname, image } = req.body;

  const updated = await userService.updateUser(userId, { nickname, image });
  res.json(User.fromEntity(updated));
};

export const changeUserPassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  await userService.changePassword(userId, { currentPassword, newPassword });
  res.status(204).send();
};

export const userProducts = async (req, res) => {
  const userId = req.user.id;
  const { limit, cursorId } = req.query;

  const { entities, nextCursorId } = await userService.listUserProducts(userId, {
    limit,
    cursorId,
  });

  res.json({
    items: entities.map(Product.fromEntity),
    nextCursorId,
  });
};

export const likedProducts = async (req, res) => {
  const userId = req.user.id;
  const { limit, cursorId } = req.query;

  const { entities, nextCursorId } = await userService.listLikedProducts(userId, {
    limit,
    cursorId,
  });

  res.json({
    items: entities.map(Product.fromEntity),
    nextCursorId,
  });
};

export const likedArticles = async (req, res) => {
  const userId = req.user.id;
  const { limit, cursorId } = req.query;

  const { entities, nextCursorId } = await userService.listLikedArticles(userId, {
    limit,
    cursorId,
  });

  res.json({
    items: entities.map(Article.fromEntity),
    nextCursorId,
  });
};
