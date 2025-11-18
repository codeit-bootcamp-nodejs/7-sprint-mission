// ProductService.js
import axios from "axios";
import { logAndThrow } from "./util.js";
// product.js에서 클래스가 올바르게 임포트되었다고 가정합니다.
import { ElectronicProduct, Product } from "./product.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app/products";

// ## Product 요청 함수 구현하기

// --- 1. getProductList() : 상품 목록 가져오기 (GET)
export async function getProductList(params) {
  try {
    if (typeof params !== "object") {
      throw new Error("Invalid parameter", { cause: params });
    }

    // 쿼리 파라미터 (page, pageSize, keyword)를 params로 전달
    const response = await axios.get(BASE_URL, { params });

    // API 응답 구조에 따라 .list 또는 .products 중 하나를 사용해야 할 수 있습니다.
    // 기존 코드의 .list를 유지하되, 주석으로 .products 가능성을 남겨둡니다.
    const items = response.data.list || response.data.products || [];

    // map 함수 내에서 productFromInfo를 호출하여 Product/ElectronicProduct 인스턴스 반환
    return items.map(productFromInfo);
  } catch (e) {
    logAndThrow("getting product list", e);
  }
}

// --- 2. getProduct() : 특정 상품 가져오기 (GET)
export async function getProduct(productId) {
  try {
    // URL에 productId를 포함
    const response = await axios.get(`${BASE_URL}/${productId}`);

    if (response.status !== 200) {
      throw new Error("Response failed", { cause: response });
    }

    return productFromInfo(response.data);
  } catch (e) {
    logAndThrow("getting product", e);
  }
}

// --- 3. createProduct() : 상품 생성 (POST)
export async function createProduct(productInfo) {
  // product 매개변수 이름을 productInfo로 변경 (title, content, image 포함)
  try {
    // request body에 productInfo(title, content, image 등) 객체를 포함하여 POST 요청
    const response = await axios.post(BASE_URL, productInfo);

    // POST 성공 시 201 Created가 반환될 수도 있으나, API 문서에 따라 200/201을 확인해야 합니다.
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Response failed", { cause: response });
    }

    return response.data;
  } catch (e) {
    logAndThrow("creating product", e);
  }
}

// --- 4. patchProduct() : 상품 수정 (PATCH)
export async function patchProduct(id, productInfo) {
  // id와 productInfo를 인자로 받음
  try {
    // URL 경로 변수 이름 수정: 기존 코드의 productId를 id로 변경 (함수 인자와 일치)
    // request body에 productInfo를 포함하여 PATCH 요청
    const response = await axios.patch(`${BASE_URL}/${id}`, productInfo);
    return response.data;
  } catch (e) {
    // 기존 코드의 "patching product"를 유지
    logAndThrow("patching product", e);
  }
}

// --- 5. deleteProduct() : 상품 삭제 (DELETE)
export async function deleteProduct(productId) {
  try {
    const response = await axios.delete(`${BASE_URL}/${productId}`);
    return response.data.id;
  } catch (e) {
    logAndThrow("deleting product", e);
  }
}

// --- productFromInfo(): 응답 데이터를 Product 또는 ElectronicProduct 인스턴스로 변환
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
