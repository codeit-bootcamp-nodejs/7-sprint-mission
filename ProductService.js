// Product 요청 함수 구현하기
// https://panda-market-api-crud.vercel.app/docs 의 Product API를 이용

import axios from "axios"; //axios 기능 불러오기
import { ElectronicProduct, Product } from "./main.js";
import { logAndThrow } from "./until.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app/products";

/*page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
 * Product 리스트 조회
 * @param {Object} params - 쿼리 파라미터 { page, pageSize, keyword }
 * @returns {Promise<Object>} Product 리스트 데이터
 */
export async function getProductList(params) {
  try {
    const response = await axios.get(BASE_URL, { params });

    return response.data.list.map(Product.of);
  } catch (e) {
    logAndThrow("getting product list", e);
  }
}
/*
작동 테스트
getProductList({ page: 1, pageSize: 5 }).then(console.log);
*/

/* 특정 Product 조회
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Product 데이터
 */
export async function getProduct(productId) {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}`);

    return productFromInfo(response.data);
  } catch (e) {
    logAndThrow("getting product", e);
  }
}
/*
작동 테스트
getProduct(2793).then(console.log);
*/

/*createProduct() : POST 메소드를 사용해 주세요. product 생성
 * request body에 name, description, price, tags, images 를 포함해 주세요.
 * @param {Product} product
 * @returns {Promise<Object>} 생성된 Product 데이터
 */
export async function createProduct(product) {
  try {
    const response = await axios.post(BASE_URL, product);
    return response.data;
  } catch (e) {
    logAndThrow("creating product", e);
  }
}
/*
작동 테스트
createProduct({
  name: "🐶강아지",
  description: "string",
  price: "300000",
  tags: "Pet",
  images: "https://t1.daumcdn.net/cfile/tistory/995F9E435B6C5B9E22",
}).then(console.log);
*/

/* patchProduct() : Product 수정
 * @param {number} productId - Product ID
 * @param {Object} product - 수정할 데이터 (name, description, price, tags, images 중 일부 또는 전부)
 * @returns {Promise<Object>} 수정된 Product 데이터
 */
export async function patchProduct(productId, product) {
  try {
    const response = await axios.patch(`${BASE_URL}/${productId}`, product);
    return response.data;
  } catch (e) {
    logAndThrow("patching product", e);
  }
}
/*
작동 테스트
patchProduct(2793, {
  name: "맥북",
  description: "맥북 air",
  price: "1600000",
  tags: "전자제품",
  images:
    "https://www.apple.com/assets-www/en_WW/mac/01_product_tile/small/mba_13_15_e1e5effed_2x.jpg",
}).then(console.log);
*/

/*deleteProduct()  - Product 삭제
 * @param {number} productId - Product ID
 * @returns {Promise<void>}
 */
export async function deleteProduct(productId) {
  try {
    const response = await axios.delete(`${BASE_URL}/${productId}`);
    console.log("Product 삭제 성공:");
    console.log(`- ID: ${productId} 상품이 삭제되었습니다.`);

    return Product.of(response.data);
  } catch (e) {
    logAndThrow("deleting product", e);
  }
}
/*
작동 테스트
deleteProduct(2789).then(console.log);
*/

/*getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장해 주세요.
*해시태그에 "전자제품"이 포함되어 있는 상품들은 Product 클래스 대신 ElectronicProduct 클래스를 사용해 인스턴스를 생성해 주세요.
나머지 상품들은 모두 Product 클래스를 사용해 인스턴스를 생성해 주세요.
*/
function productFromInfo(productInfo) {
  const { name, description, price, tags, images, manufacturer } = productInfo;
  if (tags.includes("전자제품")) {
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
