import axios from "axios";
import { ElectronicProduct, Product } from "./main.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app";

export async function getProductList(params = {}) {
  try {
    const response = await axios.get(`${BASE_URL}/products`, { params });

    console.log("Product 리스트 조희 성공:");
    console.log(`- 총 ${response.data.list.length}개의 상품을 가져왔습니다.`);

    return response.data.list.map(productFromInfo);
  } catch (error) {
    //요청 설정 중에 오류가 발생힌 경우
    console.error("product 리스트 조회 실패:", error.message);
    throw error;
  }
}

export async function getProduct(productId) {
  try {
    const response = await axios.get(`${BASE_URL}/products/${productId}`);

    console.log("Product 조회 성공:");
    console.log(`- ID: ${response.data.id}, 상품명 : ${response.data.name}`);

    return productFromInfo(response.data);
  } catch (error) {
    console.error(`Product 조회 실패 (ID: ${productId}):`, error.message);
    throw error;
  }
}

export async function createProduct(product) {
  try {
    const { name, description, price, tags, images } = product;

    const response = await axios.post(`${BASE_URL}/products`, {
      name,
      description,
      price,
      tags,
      images,
    });

    console.log("Product 생성 성공:");
    console.log(`- ID: ${response.data.id}, 상품명 ${response.data.name}`);

    return response.data;
  } catch (error) {
    console.error("Product 생성 실패:", error.message);
    throw error;
  }
}

export async function patchProduct(productId, updateData) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/products/${productId}`,
      updateData
    );

    console.log("Product 수정 성공:");
    console.log(`- ID: ${response.data.id}, 상품명: ${response.data.name}`);

    return response.data;
  } catch (error) {
    console.error(`Product 수정 실패 (ID: ${productId}):`, error.message);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    await axios.delete(`${BASE_URL}/products/${productId}`);

    console.log("Product 삭제 성공:");
    console.log(`- ID: ${productId} 상품이 삭제되었습니다.`);

    return null;
  } catch (error) {
    console.error(`Product 삭제 실패 (ID: ${productId}):`, error.message);
    throw error;
  }
}

function validatedPropertyName(availableNames, targetObject) {
  const available = new Set(availableNames);
  const propertyNames = Object.keys(targetObject);
  if (!propertyNames.every((key) => available.has(key))) {
    throw new Error(`${propertyNames} are not in ${availableNames}`);
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

//// 아래는 테스트 코드 입니다.
//getProductList 시행 코드
const list = { page: 2, pageSize: 10 };

getProductList(list).then((getList) => console.log(getList));

//getProduct 시행 코드
const id = 2805;

getProduct(id).then((get) => console.log(get));

//createProduct 시행 코드
const ProductRegistration = {
  name: "상품이름",
  description: "string",
  price: 20000,
  tags: ["전자제품"],
  images: ["https://example.com/..."],
};

createProduct(ProductRegistration).then((create) => console.log(create));

// patchProduct 시행 코드
const modifyProductId = 2805;
const ProductUdate = { name: "가전제품" };

patchProduct(modifyProductId, ProductUdate).then((patch) => console.log(patch));

//deleteProduct함수 시행 코드
const deleteId = 2806;

deleteProduct(deleteId).then((delProduct) => console.log(delProduct));
