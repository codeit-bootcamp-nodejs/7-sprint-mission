import * as articleService from '../services/article.service.js';
import { NotFoundError } from '../utils/custom-error.js';
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const createArticle = asyncHandler(async (req, res) => {
  const article = await articleService.createArticle(req.body);
  res.status(201).json(article);
});
export const getArticles = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const search = req.query.search || '';
  const { list, totalCount } = await articleService.getArticles(limit, offset, search);
  res.status(200).json({ totalCount, list });
});
export const getArticleById = asyncHandler(async (req, res) => {
  const article = await articleService.getArticleById(req.params.id);
  if (!article) throw new NotFoundError('게시글을 찾을 수 없습니다.');
  res.status(200).json(article);
});
export const updateArticle = asyncHandler(async (req, res) => {
  const article = await articleService.updateArticle(req.params.id, req.body);
  res.status(200).json(article);
});
export const deleteArticle = asyncHandler(async (req, res) => {
  await articleService.deleteArticle(req.params.id);
  res.status(204).send();
});
