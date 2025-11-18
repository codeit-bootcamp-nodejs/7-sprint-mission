import axios from "axios";
import { logAndThrow } from "./util.js";
import { ElectronicProduct, Product } from "./product.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app/products";

export async function getProductList(params) {
  try {
    if (typeof params !== "object") {
      throw new Error("Invalid parameter", { cause: params });
    }
    const response = await axios.get(BASE_URL, { params });

    const items = response.data.list || response.data.products || [];

    return items.map(productFromInfo);
  } catch (e) {
    logAndThrow("getting product list", e);
  }
}

export async function getProduct(productId) {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}`);

    if (response.status !== 200) {
      throw new Error("Response failed", { cause: response });
    }

    return productFromInfo(response.data);
  } catch (e) {
    logAndThrow("getting product", e);
  }
}

export async function createProduct(productInfo) {
  try {
    const response = await axios.post(BASE_URL, productInfo);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Response failed", { cause: response });
    }

    return response.data;
  } catch (e) {
    logAndThrow("creating product", e);
  }
}

export async function patchProduct(id, productInfo) {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, productInfo);
    return response.data;
  } catch (e) {
    logAndThrow("patching product", e);
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await axios.delete(`${BASE_URL}/${productId}`);
    return response.data.id;
  } catch (e) {
    logAndThrow("deleting product", e);
  }
}

function productFromInfo({
  name,
  description,
  price,
  tags,
  images,
  manufacturer,
}) {
  if (tags && tags.includes("전자제품")) {
    return new ElectronicProduct(
      name,
      description,
      price,
      tags,
      images,
      manufacturer
    );
  }

  return new Product(name, description, price, tags, images);
}
