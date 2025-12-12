import * as productService from "./productService.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "상품 생성 완료.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts(req.query);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 상품 ID입니다.",
      });
    }

    const product = await productService.getProductById(id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productService.deleteProductById(id);

    res.status(200).json({
      success: true,
      massage: "상품이 삭제되었습니다.",
      data: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProductById(
      req.params.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "상품 정보 변경 완료.",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};
