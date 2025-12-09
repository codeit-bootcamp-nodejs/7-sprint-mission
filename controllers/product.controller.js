import * as productService from '../services/product.service.js';
import { NotFoundError } from '../utils/custom-error.js';
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
});
export const getProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const search = req.query.search || '';
  const { list, totalCount } = await productService.getProducts(limit, offset, search);
  res.status(200).json({ totalCount, list });
});
export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) throw new NotFoundError('상품을 찾을 수 없습니다.');
  res.status(200).json(product);
});
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json(product);
});
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).send();
});
