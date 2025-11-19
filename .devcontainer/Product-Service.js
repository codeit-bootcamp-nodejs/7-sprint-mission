import axios from "axios";
import { logAndThrow } from "./Article-Service";
import { ElectronicProduct } from "./main";

const BASE_URL = "https://panda-market-api-crud.vercel.app/products";

// 서버 응답 → ElectronicProduct 객체 변환
export const productFromInfo = ({ title, price, description, image }) =>
  new ElectronicProduct(title, price, description, image);

export async function getProductList(params) {
  try {
    const response = await axios.get(BASE_URL, { params });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`response failed ${response.status}`, {
        cause: response,
      });
    }
    return response.data.list.map(productFromInfo);
  } catch (e) {
    logAndThrow(e);
    throw e;
  }
}

export async function getProduct(productId) {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}`);
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch product ${productId} with status: ${response.status}`,
        { cause: response }
      );
    }
    return productFromInfo(response.data);
  } catch (e) {
    logAndThrow(e);
    throw e;
  }
}

export async function createProduct(product) {
  try {
    const response = await axios.post(BASE_URL, product);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to create product with status : ${response.status}`,
        { cause: response }
      );
    }
    return productFromInfo(response.data);
  } catch (e) {
    logAndThrow(e);
    throw e;
  }
}

export async function patchProduct(productId, product) {
  try {
    const response = await axios.patch(`${BASE_URL}/${productId}`, product);
    if (response.status !== 200) {
      throw new Error(
        `Failed to update product ${productId} with status: ${response.status}`,
        { cause: response }
      );
    }
    return productFromInfo(response.data);
  } catch (e) {
    logAndThrow(e);
    throw e;
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await axios.delete(`${BASE_URL}/${productId}`);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to delete product ${productId} with status : ${response.status}`,
        { cause: response }
      );
    }
    return true;
  } catch (e) {
    logAndThrow(e);
    throw e;
  }
}
